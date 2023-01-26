/** @odoo-module */
/* global Sha1 */

import { NumberPopup } from "@point_of_sale/js/Popups/NumberPopup";
import { SelectionPopup } from "@point_of_sale/js/Popups/SelectionPopup";
import { ErrorPopup } from "@point_of_sale/js/Popups/ErrorPopup";

// FIXME POSREF make this into a hook or something
export const SelectCashierMixin = {
    async askPin(employee) {
        const { confirmed, payload: inputPin } = await this.showPopup(NumberPopup, {
            isPassword: true,
            title: this.env._t("Password ?"),
            startingValue: null,
        });

        if (!confirmed) {
            return;
        }

        if (employee.pin === Sha1.hash(inputPin)) {
            return employee;
        } else {
            await this.showPopup(ErrorPopup, {
                title: this.env._t("Incorrect Password"),
            });
            return;
        }
    },

    /**
     * Select a cashier, the returning value will either be an object or nothing (undefined)
     */
    async selectCashier() {
        if (this.env.pos.config.module_pos_hr) {
            const employeesList = this.env.pos.employees
                .filter((employee) => employee.id !== this.env.pos.get_cashier().id)
                .map((employee) => {
                    return {
                        id: employee.id,
                        item: employee,
                        label: employee.name,
                        isSelected: false,
                    };
                });
            let { confirmed, payload: employee } = await this.showPopup(SelectionPopup, {
                title: this.env._t("Change Cashier"),
                list: employeesList,
            });

            if (!confirmed) {
                return;
            }

            if (employee && employee.pin) {
                employee = await this.askPin(employee);
            }
            if (employee) {
                this.env.pos.set_cashier(employee);
            }
            return employee;
        }
    },

    async barcodeCashierAction(code) {
        const employee = this.env.pos.employees.find((emp) => emp.barcode === Sha1.hash(code.code));
        if (
            employee &&
            employee !== this.env.pos.get_cashier() &&
            (!employee.pin || (await this.askPin(employee)))
        ) {
            this.env.pos.set_cashier(employee);
        }
        return employee;
    },
};
