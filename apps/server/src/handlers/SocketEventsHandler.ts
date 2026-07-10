import { Events } from "@pinturillo/shared/src/events";
import { MiddlewareFn, WsContext } from "../types/middleware";

export class SocketEventsHandler {
  private events = new Map<Events, MiddlewareFn[]>();

  on(event: Events, middlewares: MiddlewareFn[]): this {
    this.events.set(event, middlewares);

    return this;
  }

  handle(ctx: WsContext) {
    const { event } = ctx?.payload;

    if (!event) return;

    const middlewares = this.events.get(event);

    if (!middlewares || middlewares?.length === 0) return;

    this.runMiddlewares(ctx, middlewares, 0);
  }

  runMiddlewares(data: WsContext, middlewares: MiddlewareFn[], index: number) {
    if (index >= middlewares.length) return;

    const middleware = middlewares[index];

    if (!middleware) return;

    const next = (middlewareArgs: any) => {
      this.runMiddlewares({ ...data, ...middlewareArgs }, middlewares, index + 1);
    };

    middleware(data, next);
  }
}
