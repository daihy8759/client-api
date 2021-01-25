import ClientApi from './clientApi';

class DocumentApi extends ClientApi {
    print(param) {
        super.send(
            {
                address: '/api/print',
                method: 'POST',
                params: param.param,
            },
            param.onSuccess,
            param.onError
        );
    }
}

export default DocumentApi;
