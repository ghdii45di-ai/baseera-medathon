"""One origin and one model-owning worker. Hosts supply PORT."""
import os
import uvicorn

if __name__ == '__main__':
    uvicorn.run('backend.main:app', host='0.0.0.0', port=int(os.getenv('PORT', '7860')),
                workers=1, limit_concurrency=4, timeout_keep_alive=5,
                proxy_headers=True, forwarded_allow_ips=os.getenv('FORWARDED_ALLOW_IPS', '127.0.0.1'))
