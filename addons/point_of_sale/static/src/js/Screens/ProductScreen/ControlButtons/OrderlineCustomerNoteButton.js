/** @odoo-module */

import { PosComponent } from "@point_of_sale/js/PosComponent";
import { ProductScreen } from "@point_of_sale/js/Screens/ProductScreen/ProductScreen";
import { useListener } from "@web/core/utils/hooks";
import { TextAreaPopup } from "@point_of_sale/js/Popups/TextAreaPopup";

export class OrderlineCustomerNoteButton extends PosComponent {
    static template = "OrderlineCustomerNoteButton";

    setup() {
        super.setup();
        useListener("click", this.onClick);
    }
    async onClick() {
        const selectedOrderline = this.env.pos.get_order().get_selected_orderline();
        if (!selectedOrderline) {
            return;
        }

        const { confirmed, payload: inputNote } = await this.showPopup(TextAreaPopup, {
            startingValue: selectedOrderline.get_customer_note(),
            title: this.env._t("Add Customer Note"),
        });

        if (confirmed) {
            selectedOrderline.set_customer_note(inputNote);
        }
    }
}

ProductScreen.addControlButton({
    component: OrderlineCustomerNoteButton,
});
