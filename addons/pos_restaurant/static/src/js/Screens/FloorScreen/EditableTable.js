/** @odoo-module */

import { useListener } from "@web/core/utils/hooks";
import { PosComponent } from "@point_of_sale/js/PosComponent";

import { Draggable } from "@point_of_sale/js/Misc/Draggable";
import { Resizeable } from "../../Resizeable";

const { onMounted, onPatched } = owl;

export class EditableTable extends PosComponent {
    static template = "EditableTable";
    static components = { Draggable, Resizeable };

    setup() {
        super.setup();
        useListener("resize-end", this._onResizeEnd);
        useListener("drag-end", this._onDragEnd);
        onPatched(this._setElementStyle.bind(this));
        onMounted(this._setElementStyle.bind(this));
    }
    _setElementStyle() {
        const table = this.props.table;
        function unit(val) {
            return `${val}px`;
        }
        const style = {
            width: unit(table.width),
            height: unit(table.height),
            "line-height": unit(table.height),
            top: unit(table.position_v),
            left: unit(table.position_h),
            "border-radius": table.shape === "round" ? unit(1000) : "3px",
        };
        if (table.color) {
            style.background = table.color;
        }
        if (table.height >= 150 && table.width >= 150) {
            style["font-size"] = "32px";
        }
        Object.assign(this.el.style, style);
    }
    _onResizeEnd(event) {
        const { size, loc } = event.detail;
        const table = this.props.table;
        table.width = size.width;
        table.height = size.height;
        table.position_v = loc.top;
        table.position_h = loc.left;
        this.props.onSaveTable(this.props.table);
    }
    _onDragEnd(event) {
        const { loc } = event.detail;
        const table = this.props.table;
        table.position_v = loc.top;
        table.position_h = loc.left;
        this.props.onSaveTable(this.props.table);
    }
}
