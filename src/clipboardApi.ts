import ClientApi, { ClientParam } from './clientApi';

class ClipboardApi extends ClientApi {
    /**
     * 复制文本
     * @param param {@see ClientParam}
     */
    copyText(param: ClientParam) {
        super.postSend('/api/clipboard', {
            ...param,
            param: {
                ...param.param,
                Type: 'text',
            },
        });
    }

    /**
     * 复制图片
     * @param param {@see ClientParam}
     */
    copyImage(param: ClientParam) {
        super.postSend('/api/clipboard', {
            ...param,
            param: {
                ...param.param,
                Type: 'image',
            },
        });
    }
}

export default ClipboardApi;
