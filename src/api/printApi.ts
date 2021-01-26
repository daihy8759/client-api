import ClientApi, { ClientParam } from './clientApi';

class PrintApi extends ClientApi {
    print(param: ClientParam) {
        super.postSend('/api/print', param);
    }

    /**
     * 打印PDF
     * @param param {@see ClientParam}
     */
    printPdf(param: ClientParam) {
        super.postSend('/api/print/pdf', param);
    }

    /**
     * 打印WORD
     * @param param {@see ClientParam}
     */
    printWord(param: ClientParam) {
        super.postSend('/api/print/word', param);
    }

    /**
     * 打印图片
     * @param param {@see ClientParam}
     */
    printImage(param: ClientParam) {
        super.postSend('/api/print/image', param);
    }

    /**
     * 打印图片
     * @param param {@see ClientParam}
     */
    printHtml(param: ClientParam) {
        super.postSend('/api/print/html', param);
    }
}

export default PrintApi;
