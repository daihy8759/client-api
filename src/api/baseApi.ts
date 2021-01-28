import ClientApi, { ClientParam } from './clientApi';

class BaseApi extends ClientApi {
    /**
     * 自定义协议启动
     * @param param {@see ClientParam}
     */
    uriSchemeStart(param: ClientParam) {
        super.postSend('/api/base/uriScheme/start', param);
    }
}

export default BaseApi;
