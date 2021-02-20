import ClientApi, { ClientParam } from './clientApi';

type CropParam = {
    param: {
        ImgBase64: string;
    };
} & ClientParam;

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

    /**
     * 切边
     * @param param {@see CropParam}
     */
    cropIdCard(param: CropParam) {
        super.postSend('/api/device/idcard/crop', param);
    }
}

export default DeviceApi;
