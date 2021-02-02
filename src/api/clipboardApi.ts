import ClientApi, { ClientParam } from './clientApi';

type copyType = 'text' | 'image';

interface ClipboardRequestParam {
    /** 图片地址(1.0.8支持) */
    Url: string;
    /** 文本或图片base64 */
    Text: string;
    /** 复制类型 */
    Type?: copyType;
}

interface ClipboardParam extends ClientParam {
    param: ClipboardRequestParam;
}

class ClipboardApi extends ClientApi {
    /**
     * 复制文本
     * @param param {@see ClipboardParam}
     */
    copyText(param: ClipboardParam) {
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
     * @param param {@see ClipboardParam}
     */
    copyImage(param: ClipboardParam) {
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
