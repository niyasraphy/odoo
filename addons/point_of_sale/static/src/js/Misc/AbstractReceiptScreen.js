/** @odoo-module */

import { PosComponent } from "@point_of_sale/js/PosComponent";
import { ConfirmPopup } from "../Popups/ConfirmPopup";
import { ErrorPopup } from "../Popups/ErrorPopup";

const { useRef } = owl;

/**
 * This relies on the assumption that there is a reference to
 * `order-receipt` so it is important to declare a `t-ref` to
 * `order-receipt` in the template of the Component that extends
 * this abstract component.
 */
export class AbstractReceiptScreen extends PosComponent {
    setup() {
        super.setup();
        this.orderReceipt = useRef("order-receipt");
    }
    async _printReceipt() {
        if (this.env.proxy.printer) {
            const printResult = await this.env.proxy.printer.print_receipt(
                this.orderReceipt.el.innerHTML
            );
            if (printResult.successful) {
                return true;
            } else {
                const { confirmed } = await this.showPopup(ConfirmPopup, {
                    title: printResult.message.title,
                    body: "Do you want to print using the web printer?",
                });
                if (confirmed) {
                    // We want to call the _printWeb when the popup is fully gone
                    // from the screen which happens after the next animation frame.
                    await new Promise(requestAnimationFrame);
                    return await this._printWeb();
                }
                return false;
            }
        } else {
            return await this._printWeb();
        }
    }
    async _printWeb() {
        try {
            window.print();
            return true;
        } catch {
            await this.showPopup(ErrorPopup, {
                title: this.env._t("Printing is not supported on some browsers"),
                body: this.env._t(
                    "Printing is not supported on some browsers due to no default printing protocol " +
                        "is available. It is possible to print your tickets by making use of an IoT Box."
                ),
            });
            return false;
        }
    }
}
