const Util = require('../util')

export default async request => {
    try {
        
        let origin = request.headers.get("Origin");
        let _headers =Util.getHeaders(origin);
            return new Response(null, {
                headers: _headers
            });
       
    } catch (err) {
        const errorText =
            "CORS error."
        return new Response(errorText);
    }
}