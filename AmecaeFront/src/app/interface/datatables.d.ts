// datatables.d.ts
import 'jquery';
import 'datatables.net';

declare module 'datatables.net' {
    interface Settings {
        buttons?: string[] | Array<{ extend: string, text?: string, className?: string, action?: (e: any, dt: any, node: any, config: any) => void }>;
    }
}
