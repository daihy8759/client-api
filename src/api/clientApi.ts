import fly from 'flyio';
import { isFunction } from '../utils';

interface ClientApiOptions {
    httpHost?: string;
    httpPort?: number;
    httpsHost?: string;
    httpsPort?: number;
    onSuccess?: (message: string) => void;
    onError?: (error: string) => void;
}

export interface ClientParam {
    param: any[] | object;
    onSuccess: (message: string) => void;
    onError?: (error: string) => void;
}

interface RequestData {
    address: string;
    method: string;
    params: object;
}

interface WebsocketIns extends WebSocket {
    messageChannels?: object;
}

const connectionErrorMessage =
    '无法连接到客户端插件服务，请确认客户端插件是否已启动';

class ClientApi {
    private webSocketAddress: string;
    private httpAddress: string;
    private websocketInstance: WebsocketIns | null = null;
    private onSuccess?: Fn;
    private onError?: Fn;

    constructor(options: ClientApiOptions = {}) {
        const httpHost = options.httpHost || '127.0.0.1';
        const httpPort = options.httpPort || 14321;
        const httpsHost = options.httpsHost || 'fx.local';
        const httpsPort = options.httpsPort || 14322;
        this.onSuccess = options.onSuccess;
        this.onError = options.onError;
        if ('https:' == document.location.protocol) {
            this.webSocketAddress = `wss://${httpsHost}:${httpsPort}/client-api`;
            this.httpAddress = `https://${httpsHost}:${httpsPort}`;
        } else {
            this.webSocketAddress = `ws://${httpHost}:${httpPort}/client-api`;
            this.httpAddress = `http://${httpHost}:${httpPort}`;
        }
    }

    destroy() {
        if (this.websocketInstance) {
            this.websocketInstance.close();
            this.websocketInstance = null;
        }
    }

    send(data, successCallback, errorCallback) {
        if (this._canUseWebSocket()) {
            this._sendUseWebSocket(data, successCallback, errorCallback);
        } else {
            this._sendUseHttp(data, successCallback, errorCallback);
        }
    }

    getSend(address: string, param: ClientParam) {
        this.send(
            {
                address: address,
                method: 'GET',
                params: param.param,
            },
            param.onSuccess,
            param.onError
        );
    }

    postSend(address: string, param: ClientParam) {
        this.send(
            {
                address: address,
                method: 'POST',
                params: param.param,
            },
            param.onSuccess,
            param.onError
        );
    }

    _canUseWebSocket() {
        var userAgent = navigator.userAgent;
        if (userAgent.indexOf('Chrome') > -1) {
            return true;
        }
        if (window.location.protocol.indexOf('https') > -1) {
            return false;
        }
        if (userAgent.indexOf('MSIE') > -1) {
            var version = userAgent.match(/MSIE ([\d.]+)/)![1];
            if (!version || parseInt(version) < 10) {
                return false;
            }
        }

        return true;
    }

    _generateMessageChannel(
        websocket: WebsocketIns,
        data,
        successCallback,
        errorCallback: Fn
    ) {
        const requestId =
            Date.now().toString(36) +
            Math.random().toString(36).substr(3) +
            Math.random().toString(36).substr(3) +
            Math.random().toString(36).substr(3);
        if (websocket.messageChannels![requestId] === undefined) {
            websocket.messageChannels![requestId] = {
                SuccessCallback: successCallback,
                ErrorCallback: errorCallback,
                Data: data,
            };
            data.RequestId = requestId;
        }
    }

    _sendUseHttp(data: RequestData, successCallback: Fn, errorCallback) {
        if (!data.method) {
            console.error('参数错误');
            return;
        }
        var requestPromise;
        if (data.method === 'GET') {
            requestPromise = fly.get(this.httpAddress + '/' + data.address, {
                params: data.params,
            });
        } else {
            requestPromise = fly.post(
                this.httpAddress + '/' + data.address,
                data.params || {}
            );
        }
        requestPromise
            .then(function (response) {
                if (successCallback && typeof successCallback === 'function') {
                    successCallback(response.data);
                }
            })
            .catch(function (error) {
                if (errorCallback && typeof errorCallback === 'function') {
                    errorCallback(error);
                } else {
                    console.error(error);
                }
            });
    }

    _sendUseWebSocket(data, successCallback, errorCallback) {
        if (
            this.websocketInstance === null ||
            this.websocketInstance.readyState === WebSocket.CLOSING ||
            this.websocketInstance.readyState === WebSocket.CLOSED
        ) {
            this.websocketInstance = new WebSocket(this.webSocketAddress);
            this.websocketInstance.messageChannels = {};
            this.websocketInstance.onmessage = (event) => {
                const result = JSON.parse(event.data);
                const mc = this.websocketInstance!.messageChannels![
                    result.ResponseId
                ];
                const responseId = result.ResponseId;
                delete result['ResponseId'];
                if (result.Code !== 0) {
                    if (mc && isFunction(mc.ErrorCallback)) {
                        mc.ErrorCallback(result);
                    } else if (isFunction(this.onError)) {
                        this.onError(result);
                    }
                } else {
                    if (mc && isFunction(mc.SuccessCallback)) {
                        mc.SuccessCallback(result);
                    } else if (isFunction(this.onSuccess)) {
                        this.onSuccess(result);
                    }
                }
                delete this.websocketInstance!.messageChannels![responseId];
            };
        }

        this._generateMessageChannel(
            this.websocketInstance,
            data,
            successCallback,
            errorCallback
        );

        this.websocketInstance.onerror = () => {
            if (isFunction(this.onError)) {
                this.onError(connectionErrorMessage);
            } else {
                for (var key in this.websocketInstance!.messageChannels) {
                    var mc = this.websocketInstance!.messageChannels[key];
                    var result = {
                        Status: 0,
                        Code: 50011,
                        Message: connectionErrorMessage,
                        Title: mc.Data.Title,
                    };
                    if (
                        mc.ErrorCallback !== null &&
                        typeof mc.ErrorCallback === 'function'
                    ) {
                        mc.ErrorCallback(result);
                    }
                    delete this.websocketInstance!.messageChannels[key];
                }
            }
        };
        const requestData = JSON.stringify({
            Address: data.address,
            Method: data.method,
            Param: data.params ? JSON.stringify(data.params) : '',
            RequestId: data.RequestId,
        });
        if (this.websocketInstance.readyState === WebSocket.CONNECTING) {
            this.websocketInstance.addEventListener('open', function () {
                this.send(requestData);
            });
        } else {
            this.websocketInstance.send(requestData);
        }
    }
}

export default ClientApi;