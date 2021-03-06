import axios from 'axios';
import { isFunction } from '../utils';

interface ClientApiOptions {
    /** 默认 127.0.0.1 */
    httpHost?: string;
    /** 端口，默认 14321 */
    httpPort?: number;
    /** ssl，默认 fx.local */
    httpsHost?: string;
    /** ssl端口，默认 14322 */
    httpsPort?: number;
    /** 全局成功回调 */
    onSuccess?: (message: string) => void;
    /** 全局失败回调 */
    onError?: (error: string) => void;
}

export interface ClientParam {
    param?: any[] | object;
    /** 成功回调 */
    onSuccess: (message: string) => void;
    /** 失败回调 */
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

    private _canUseWebSocket() {
        return typeof WebSocket != 'undefined';
    }

    private _generateMessageChannel(
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

    private _sendUseHttp(
        data: RequestData,
        successCallback: Fn,
        errorCallback
    ) {
        if (!data.method) {
            console.error('参数错误');
            return;
        }
        let requestPromise: Promise<any>;
        if (data.method === 'GET') {
            requestPromise = axios.get(this.httpAddress + data.address, {
                params: data.params,
            });
        } else {
            requestPromise = axios.post(
                this.httpAddress + data.address,
                data.params || {}
            );
        }
        requestPromise
            .then(function (response) {
                if (isFunction(successCallback)) {
                    successCallback(response.data);
                }
            })
            .catch(function (error) {
                if (isFunction(errorCallback)) {
                    errorCallback(error);
                } else {
                    console.error(error);
                }
            });
    }

    private _sendUseWebSocket(data, successCallback, errorCallback) {
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
                for (let key in this.websocketInstance!.messageChannels) {
                    const mc = this.websocketInstance!.messageChannels[key];
                    const result = {
                        Success: false,
                        Code: 50011,
                        Message: connectionErrorMessage,
                    };
                    if (isFunction(mc.ErrorCallback)) {
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
