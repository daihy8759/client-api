import ClientApi, { ClientParam } from './clientApi';

class DeviceApi extends ClientApi {
    /**
     * 获取打印机
     * @param param {@see ClientParam}
     */
    getPrinters(param: ClientParam) {
        super.getSend('/api/device/printer/list', param);
    }

    /**
     * 获取默认打印机
     * @param param {@see ClientParam}
     */
    getDefaultPrinter(param: ClientParam) {
        super.getSend('/api/device/printer/default', param);
    }

    /**
     * 获取摄像头
     * @param param {@see ClientParam}
     */
    getCameras(param: ClientParam) {
        super.getSend('/api/device/camera/list', param);
    }

    /**
     * 读取身份证
     * @param param {@see ClientParam}
     */
    readIdCard(param: ClientParam) {
        super.getSend('/api/device/idcard/read', param);
    }
}

export default DeviceApi;
