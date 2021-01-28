import ClientApi, { ClientParam } from './clientApi';

type FileType = 'pdf' | 'word' | 'image' | 'html';
interface PrintWithTypeParam {
    Url: string;
    Fs: number;
    FileType: FileType;
    Printer?: string;
}

interface PrintParam {
    Url: string;
    Fs: number;
    Printer?: string;
}

interface ClientPrintWithTypeParam extends ClientParam {
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
