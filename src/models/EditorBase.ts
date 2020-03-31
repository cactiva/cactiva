import { Disposable } from "./vscode/lifecycle";
import { CactivaWorker } from "./store";

if (isNaN((window as any)._lastMsgId)) {
  (window as any)._lastMsgId = 1;
}
export default class EditorBase extends Disposable {
  private _sendMessage(type: string, message: any) {
    const id = (window as any)._lastMsgId++;
    CactivaWorker.worker.postMessage({
      type,
      message,
      id
    });
    return id;
  }

  protected executeInWorker(type: string, message: any): Promise<any> {
    return new Promise(resolve => {
      let id = -1;
      const received = (e: any) => {
        if (e.data.id === id) {
          resolve(e.data.message);
          CactivaWorker.worker.removeEventListener("message", received);
        }
      };
      CactivaWorker.worker.addEventListener("message", received);
      id = this._sendMessage(type, message);
    });
  }

  constructor() {
    super();
  }
}
