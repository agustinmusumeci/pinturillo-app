import { Events, WsEvent } from "@pinturillo/shared/src/events";
import { WsContext } from "@pinturillo/shared/src/contexts";

export type MiddlewareFn = (data: any, next: (...args: any) => void) => void;

export class SocketEventsHandler {
  private events = new Map<Events, MiddlewareFn[]>();

  on(event: Events, middlewares: MiddlewareFn[]) {
    this.events.set(event, middlewares);
  }

  handle(ctx: WsContext) {
    const { event } = JSON.parse(ctx.payload.toString()) as WsEvent;

    if (!event) return;

    const middlewares = this.events.get(event);

    if (!middlewares || middlewares?.length === 0) return;

    this.runMiddlewares(ctx, middlewares, 0);
  }

  runMiddlewares(data: any, middlwares: MiddlewareFn[], index: number) {
    if (index >= middlwares.length) return;

    const middleware = middlwares[index];

    if (!middleware) return;

    const next = (...middlewareArgs: any) => {
      this.runMiddlewares(middlewareArgs, middlwares, index + 1);
    };

    middleware(data, next);
  }
}
