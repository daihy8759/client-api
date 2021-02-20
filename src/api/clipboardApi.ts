import ClientApi, { ClientParam } from './clientApi';

type copyType = 'text' | 'image';

interface ClipboardRequestParam {
    /** 图片地址(1.0.8支持) */
    Url?: string;
    /** 文本或图片base64 */
    Text?: string;
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
        if (!param.param.Text) {
            return;
        }
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
        const requestParam = param.param || {};
        if (!requestParam.Text && !requestParam.Url) {
            return;
        }
        super.postSend('/api/clipboard', {
            ...param,
            param: {
                ...requestParam,
                Type: 'image',
            },
        });
    }
}

export default ClipboardApi;
