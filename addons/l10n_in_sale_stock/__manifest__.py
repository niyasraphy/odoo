# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': "India Sales and Warehouse Management",
    'icon': '/l10n_in/static/description/icon.png',

    'summary': """
        Define default sales journal on the warehouse""",

    'description': """
        Define default sales journal on the warehouse,
        help you to choose correct sales journal on the sales order when
        you change the warehouse.
        useful when you setup the multiple GSTIN units.
    """,

    'website': "https://www.odoo.com",
    'category': 'Sales/Sales',
    'version': '0.1',

    'depends': ['l10n_in_sale', 'l10n_in_stock'],

    'data': [
        'views/stock_warehouse_views.xml',
    ],
    'auto_install': True,
    'license': 'LGPL-3',
}
