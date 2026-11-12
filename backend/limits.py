from starlette.formparsers import MultiPartException
from starlette.responses import JSONResponse

MAX_BODY = 10 * 1024 * 1024 + 64 * 1024


class UploadLimitMiddleware:
    """Bound declared and streamed multipart bodies; parser cleans spooled files."""
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope['type'] != 'http' or scope.get('method') != 'POST':
            return await self.app(scope, receive, send)
        headers = dict(scope.get('headers', []))
        length = headers.get(b'content-length')
        try:
            too_large = length is not None and int(length) > MAX_BODY
        except ValueError:
            too_large = True
        response = JSONResponse({'detail': {'code': 'too_large'}}, status_code=413)
        if too_large:
            return await response(scope, receive, send)
        count, limited, responded = 0, False, False

        async def bounded_receive():
            nonlocal count, limited
            message = await receive()
            count += len(message.get('body', b''))
            if count > MAX_BODY:
                limited = True
                # Starlette's multipart parser closes its temporary files on this exception.
                raise MultiPartException('Request body limit exceeded')
            return message

        async def bounded_send(message):
            nonlocal responded
            if limited:
                if not responded:
                    responded = True
                    await response(scope, receive, send)
            else:
                await send(message)

        await self.app(scope, bounded_receive, bounded_send)
