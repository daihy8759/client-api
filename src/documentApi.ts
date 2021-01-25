import ClientApi, { ClientParam } from './clientApi';

class DocumentApi extends ClientApi {
    /**
     * Word转PDF
     * @param param {@see ClientParam}
     */
    wordToPDF(param: ClientParam) {
        super.postSend('/api/document/word/getPdfBytes', param);
    }

    formatDoc(param: ClientParam) {
        super.postSend('/api/document/word/format', param);
    }
}

export default DocumentApi;
