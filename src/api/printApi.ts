import ClientApi, { ClientParam } from './clientApi';

type FileType = 'pdf' | 'word' | 'image' | 'html';

interface PrintParam {
    /** 文件地址 */
    Url: string;
    /** 打印份数 */
    Fs: number;
    /** 打印机 */
    Printer?: string;
}
interface PrintWithTypeParam extends PrintParam {
    /** 文件类型 */
    FileType: FileType;
}

interface ClientPrintWithTypeParam extends ClientParam {
    /** 请求参数 */
    param: PrintWithTypeParam[];
}

interface ClientPrintParam extends ClientParam {
    param: PrintParam[];
}

class PrintApi extends ClientApi {
    /**
     * 指定类型打印
     * @param param {@see ClientPrintWithTypeParam}
     */
    print(param: ClientPrintWithTypeParam) {
        super.postSend('/api/print', param);
    }

    /**
     * 打印PDF
     * @param param {@see ClientPrintParam}
     */
    printPdf(param: ClientPrintParam) {
        super.postSend('/api/print/pdf', param);
    }

    /**
     * 打印WORD
     * @param param {@see ClientPrintParam}
     */
    printWord(param: ClientPrintParam) {
        super.postSend('/api/print/word', param);
    }

    /**
     * 打印图片
     * @param param {@see ClientPrintParam}
     */
    printImage(param: ClientPrintParam) {
        super.postSend('/api/print/image', param);
    }

    /**
     * 打印图片
     * @param param {@see ClientPrintParam}
     */
    printHtml(param: ClientPrintParam) {
        super.postSend('/api/print/html', param);
    }
}

export default PrintApi;
