import ClientApi, { ClientParam } from './clientApi';

class QrCodeApi extends ClientApi {
    /**
     * 显示二维码
     * @param param {@see ClientParam}
     */
    showQrCode(param: ClientParam) {
        super.postSend('/api/qrcode/show', param);
    }

    /**
     * 隐藏二维码
     * @param param {@see ClientParam}
     */
    hideQrCode(param: ClientParam) {
        super.postSend('/api/qrcode/hide', param);
    }
}

export default QrCodeApi;
