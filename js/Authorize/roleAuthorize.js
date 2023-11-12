$(document).ready(function () {
	// Data1
	var columnsData1 = [
		{ data: "empty", title: "#" },
		{ data: "read", title: "查看" },
		{ data: "insert", title: "編輯" },
		{ data: "update", title: "修改" },
		{ data: "delete", title: "刪除" },
	];

	var columns1 = [];

	columnsData1.forEach(function (column) {
		columns1.push({ data: column.data, title: column.title });
	});

	var table1Data = [
		{
			empty: "帳號管理",
			id: 31,
			read: '<input type="checkbox" name="rowCheckbox" data-id="31" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="31" data-column="insert" disabled/>',
			update: '<input type="checkbox" name="rowCheckbox" data-id="31" data-column="update" disableddisabled/>',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="31" data-column="delete" disabled/>',
		},
		{
			empty: "帳號列表",
			id: 32,
			read: '<input type="checkbox" name="rowCheckbox" data-id="32" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="32" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="32" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="32" data-column="delete" />',
		},
		{
			empty: "帳號資料",
			id: 33,
			read: '<input type="checkbox" name="rowCheckbox" data-id="33" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="33" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="33" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="33" data-column="delete" />',
		},
		{
			empty: "角色列表",
			id: 34,
			read: '<input type="checkbox" name="rowCheckbox" data-id="34" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="34" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="34" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="34" data-column="delete" />',
		},
		{
			empty: "角色權限",
			id: 35,
			read: '<input type="checkbox" name="rowCheckbox" data-id="35" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="35" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="35" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="35" data-column="delete" />',
		},
	];

	// Data2
	var columnsData2 = [
		{ data: "empty", title: "#" },
		{ data: "read", title: "查看" },
		{ data: "insert", title: "編輯" },
		{ data: "update", title: "修改" },
		{ data: "delete", title: "刪除" },
		{ data: "notification_lowestInventory", title: "通知列表最低庫存量不足" },
		{ data: "notification_purchase_requisition", title: "通知列表採購申請中" },
		{ data: "notification_order_new_component", title: "通知列表訂單新零件到貨" },
		{ data: "notification_ship_requisition", title: "通知列表申請出庫中" },
		{ data: "notification_shipped_wait_for_get", title: "通知列表出庫等待領取" },
	];

	var columns2 = [];

	columnsData2.forEach(function (column) {
		columns2.push({ data: column.data, title: column.title });
	});

	var table2Data = [
		{
			empty: "通知管理",
			id: 18,
			read: '<input type="checkbox" name="rowCheckbox" data-id="18" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="18" data-column="insert" disabled/>',
			update: '<input type="checkbox" name="rowCheckbox" data-id="18" data-column="update" disabled />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="18" data-column="delete" disabled/>',
			notification_lowestInventory:
				'<input type="checkbox" name="rowCheckbox" data-id="18" data-column="notification_lowestInventory" disabled />',
			notification_purchase_requisition:
				'<input type="checkbox" name="rowCheckbox" data-id="18" data-column="notification_purchase_requisition" disabled/>',
			notification_order_new_component:
				'<input type="checkbox" name="rowCheckbox" data-id="18" data-column="notification_order_new_component"disabled />',
			notification_ship_requisition:
				'<input type="checkbox" name="rowCheckbox" data-id="18" data-column="notification_ship_requisition" disabled/>',
			notification_shipped_wait_for_get:
				'<input type="checkbox" name="rowCheckbox" data-id="18" data-column="notification_shipped_wait_for_get" disabled/>',
		},
		{
			empty: "通知列表",
			id: 19,
			read: '<input type="checkbox" name="rowCheckbox" data-id="19" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="19" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="19" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="19" data-column="delete" />',
			notification_lowestInventory:
				'<input type="checkbox" name="rowCheckbox" data-id="19" data-column="notification_lowestInventory" />',
			notification_purchase_requisition:
				'<input type="checkbox" name="rowCheckbox" data-id="19" data-column="notification_purchase_requisition" />',
			notification_order_new_component:
				'<input type="checkbox" name="rowCheckbox" data-id="19" data-column="notification_order_new_component" />',
			notification_ship_requisition:
				'<input type="checkbox" name="rowCheckbox" data-id="19" data-column="notification_ship_requisition" />',
			notification_shipped_wait_for_get:
				'<input type="checkbox" name="rowCheckbox" data-id="19" data-column="notification_shipped_wait_for_get" />',
		},
	];

	//Data3
	var columnsData3 = [
		{ data: "empty", title: "#" },
		{ data: "read", title: "查看" },
		{ data: "insert", title: "編輯" },
		{ data: "update", title: "修改" },
		{ data: "delete", title: "刪除" },
	];

	var table3Data = [
		{
			empty: "門市管理",
			id: 4,
			read: '<input type="checkbox" name="rowCheckbox" data-id="4" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="4" data-column="insert" disabled/>',
			update: '<input type="checkbox" name="rowCheckbox" data-id="4" data-column="update" disabled/>',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="4" data-column="delete" disabled/>',
		},
		{
			empty: "門市列表",
			id: 5,
			read: '<input type="checkbox" name="rowCheckbox" data-id="5" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="5" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="5" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="5" data-column="delete" />',
		},
		{
			empty: "門市資料",
			id: 6,
			read: '<input type="checkbox" name="rowCheckbox" data-id="6" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="6" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="6" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="6" data-column="delete" />',
		},
	];

	var columns3 = [];

	columnsData3.forEach(function (column) {
		columns3.push({ data: column.data, title: column.title });
	});

	//Data4
	var columnsData4 = [
		{ data: "empty", title: "#" },
		{ data: "read", title: "查看" },
		{ data: "insert", title: "編輯" },
		{ data: "update", title: "修改" },
		{ data: "delete", title: "刪除" },
		{ data: "price", title: "訂價" },
		{ data: "wholesalePrice", title: "批發價" },
		{ data: "lowestWholesalePrice", title: "最低批發價" },
		{ data: "cost", title: "成本" },
	];

	var table4Data = [
		{
			empty: "零件管理",
			id: 7,
			read: '<input type="checkbox" name="rowCheckbox" data-id="7" data-column="read" disabled/>',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="7" data-column="insert" disabled/>',
			update: '<input type="checkbox" name="rowCheckbox" data-id="7" data-column="update" disabled/>',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="7" data-column="delete" disabled/>',
			price: '<input type="checkbox" name="rowCheckbox" data-id="7" data-column="price" disabled/>',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="7" data-column="wholesalePrice" disabled/>',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="7" data-column="lowestWholesalePrice" disabled />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="7" data-column="cost" disabled />',
		},
		{
			empty: "零件品牌列表",
			id: 8,
			read: '<input type="checkbox" name="rowCheckbox" data-id="8" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="8" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="8" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="8" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="8" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="8" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="8" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="8" data-column="cost" />',
		},
		{
			empty: "零件品牌資料",
			id: 9,
			read: '<input type="checkbox" name="rowCheckbox" data-id="9" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="9" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="9" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="9" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="9" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="9" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="9" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="9" data-column="cost" />',
		},
		{
			empty: "零件定義列表",
			id: 10,
			read: '<input type="checkbox" name="rowCheckbox" data-id="10" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="10" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="10" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="10" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="10" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="10" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="10" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="10" data-column="cost" />',
		},
		{
			empty: "零件定義資料",
			id: 11,
			read: '<input type="checkbox" name="rowCheckbox" data-id="11" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="11" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="11" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="11" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="11" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="11" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="11" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="11" data-column="cost" />',
		},
	];

	var columns4 = [];

	columnsData4.forEach(function (column) {
		columns4.push({ data: column.data, title: column.title });
	});

	//Data5
	var columnsData5 = [
		{ data: "empty", title: "#" },
		{ data: "read", title: "查看" },
		{ data: "insert", title: "編輯" },
		{ data: "update", title: "修改" },
		{ data: "delete", title: "刪除" },
		{ data: "price", title: "訂價" },
		{ data: "wholesalePrice", title: "批發價" },
		{ data: "lowestWholesalePrice", title: "最低批發價" },
		{ data: "cost", title: "成本" },
	];

	var table5Data = [
		{
			empty: "零件採購單管理",
			id: 36,
			read: '<input type="checkbox" name="rowCheckbox" data-id="36" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="36" data-column="insert" disabled/>',
			update: '<input type="checkbox" name="rowCheckbox" data-id="36" data-column="update" disabled/>',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="36" data-column="delete" disabled/>',
			price: '<input type="checkbox" name="rowCheckbox" data-id="36" data-column="price" disabled />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="36" data-column="wholesalePrice" disabled/>',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="36" data-column="lowestWholesalePrice" disabled/>',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="36" data-column="cost" />',
		},
		{
			empty: "零件採購單列表",
			id: 37,
			read: '<input type="checkbox" name="rowCheckbox" data-id="37" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="37" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="37" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="37" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="37" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="37" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="37" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="37" data-column="cost" />',
		},
		{
			empty: "零件採購單資料",
			id: 38,
			read: '<input type="checkbox" name="rowCheckbox" data-id="38" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="38" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="38" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="38" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="38" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="38" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="38" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="38" data-column="cost" />',
		},
	];

	var columns5 = [];

	columnsData5.forEach(function (column) {
		columns5.push({ data: column.data, title: column.title });
	});

	//Data6
	var columnsData6 = [
		{ data: "empty", title: "#" },
		{ data: "read", title: "查看" },
		{ data: "insert", title: "編輯" },
		{ data: "update", title: "修改" },
		{ data: "delete", title: "刪除" },
		{ data: "price", title: "訂價" },
		{ data: "wholesalePrice", title: "批發價" },
		{ data: "lowestWholesalePrice", title: "最低批發價" },
		{ data: "cost", title: "成本" },
		{ data: "order_execute_ship", title: "訂單執行出庫" },
		{ data: "order_delete_component", title: "訂單刪除零件" },
		{ data: "order_unsubscribe", title: "訂單退貨" },
		{ data: "order_complete", title: "訂單訂單完成" },
	];

	var table6Data = [
		{
			empty: "訂單管理",
			id: 12,
			read: '<input type="checkbox" name="rowCheckbox" data-id="12" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="12" data-column="insert" disabled/>',
			update: '<input type="checkbox" name="rowCheckbox" data-id="12" data-column="update" disabled/>',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="12" data-column="delete" disabled />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="12" data-column="price" disabled />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="12" data-column="wholesalePrice" disabled />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="12" data-column="lowestWholesalePrice" disabled />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="12" data-column="cost" disabled />',
			order_execute_ship:
				'<input type="checkbox" name="rowCheckbox" data-id="12" data-column="order_execute_ship" disabled />',
			order_delete_component:
				'<input type="checkbox" name="rowCheckbox" data-id="12" data-column="order_delete_component" disabled />',
			order_unsubscribe:
				'<input type="checkbox" name="rowCheckbox" data-id="12" data-column="order_unsubscribe" disabled />',
			order_complete: '<input type="checkbox" name="rowCheckbox" data-id="12" data-column="order_complete" disabled/>',
		},
		{
			empty: "搜尋零件",
			id: 13,
			read: '<input type="checkbox" name="rowCheckbox" data-id="13" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="13" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="13" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="13" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="13" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="13" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="13" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="13" data-column="cost" />',
			order_execute_ship:
				'<input type="checkbox" name="rowCheckbox" data-id="13" data-column="order_execute_ship" disabled />',
			order_delete_component:
				'<input type="checkbox" name="rowCheckbox" data-id="13" data-column="order_delete_component" disabled />',
			order_unsubscribe:
				'<input type="checkbox" name="rowCheckbox" data-id="13" data-column="order_unsubscribe" disabled />',
			order_complete: '<input type="checkbox" name="rowCheckbox" data-id="13" data-column="order_complete" disabled/>',
		},
		{
			empty: "訂單列表",
			id: 14,
			read: '<input type="checkbox" name="rowCheckbox" data-id="14" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="14" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="14" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="14" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="14" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="14" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="14" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="14" data-column="cost" />',
			order_execute_ship:
				'<input type="checkbox" name="rowCheckbox" data-id="14" data-column="order_execute_ship" disabled />',
			order_delete_component:
				'<input type="checkbox" name="rowCheckbox" data-id="14" data-column="order_delete_component" disabled />',
			order_unsubscribe:
				'<input type="checkbox" name="rowCheckbox" data-id="14" data-column="order_unsubscribe" disabled />',
			order_complete: '<input type="checkbox" name="rowCheckbox" data-id="14" data-column="order_complete" disabled/>',
		},
		{
			empty: "訂單資料",
			id: 15,
			read: '<input type="checkbox" name="rowCheckbox" data-id="15" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="15" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="15" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="15" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="15" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="15" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="15" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="15" data-column="cost" />',
			order_execute_ship: '<input type="checkbox" name="rowCheckbox" data-id="15" data-column="order_execute_ship" />',
			order_delete_component:
				'<input type="checkbox" name="rowCheckbox" data-id="15" data-column="order_delete_component" />',
			order_unsubscribe: '<input type="checkbox" name="rowCheckbox" data-id="15" data-column="order_unsubscribe" />',
			order_complete: '<input type="checkbox" name="rowCheckbox" data-id="15" data-column="order_complete" />',
		},
		{
			empty: "退貨單列表",
			id: 16,
			read: '<input type="checkbox" name="rowCheckbox" data-id="16" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="16" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="16" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="16" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="16" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="16" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="16" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="16" data-column="cost" />',
			order_execute_ship:
				'<input type="checkbox" name="rowCheckbox" data-id="16" data-column="order_execute_ship" disabled />',
			order_delete_component:
				'<input type="checkbox" name="rowCheckbox" data-id="16" data-column="order_delete_component" disabled />',
			order_unsubscribe:
				'<input type="checkbox" name="rowCheckbox" data-id="16" data-column="order_unsubscribe" disabled />',
			order_complete: '<input type="checkbox" name="rowCheckbox" data-id="16" data-column="order_complete" disabled />',
		},
		{
			empty: "退貨單資料",
			id: 17,
			read: '<input type="checkbox" name="rowCheckbox" data-id="17" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="17" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="17" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="17" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="17" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="17" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="17" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="17" data-column="cost" />',
			order_execute_ship:
				'<input type="checkbox" name="rowCheckbox" data-id="17" data-column="order_execute_ship" disabled />',
			order_delete_component:
				'<input type="checkbox" name="rowCheckbox" data-id="17" data-column="order_delete_component" disabled />',
			order_unsubscribe:
				'<input type="checkbox" name="rowCheckbox" data-id="17" data-column="order_unsubscribe" disabled />',
			order_complete: '<input type="checkbox" name="rowCheckbox" data-id="17" data-column="order_complete" disabled />',
		},
	];

	var columns6 = [];

	columnsData6.forEach(function (column) {
		columns6.push({ data: column.data, title: column.title });
	});

	//Data7

	var columnsData7 = [
		{ data: "empty", title: "#" },
		{ data: "read", title: "查看" },
		{ data: "insert", title: "編輯" },
		{ data: "update", title: "修改" },
		{ data: "delete", title: "刪除" },
		{ data: "ship_ship_requisition", title: "出庫單申請出庫" },
		{ data: "ship_ship_approve", title: "出庫單同意出庫" },
		{ data: "ship_ship_receive", title: "出庫單領取零件" },
		{ data: "ship_ship_cancel", title: "出庫單取消出庫" },
	];

	var table7Data = [
		{
			empty: "出入庫管理",
			id: 20,
			read: '<input type="checkbox" name="rowCheckbox" data-id="20" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="20" data-column="insert" disabled/>',
			update: '<input type="checkbox" name="rowCheckbox" data-id="20" data-column="update" disabled/>',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="20" data-column="delete" disabled/>',
			ship_ship_requisition:
				'<input type="checkbox" name="rowCheckbox" data-id="20" data-column="ship_ship_requisition" disabled/>',
			ship_ship_approve:
				'<input type="checkbox" name="rowCheckbox" data-id="20" data-column="ship_ship_approve" disabled />',
			ship_ship_receive:
				'<input type="checkbox" name="rowCheckbox" data-id="20" data-column="ship_ship_receive" disabled />',
			ship_ship_cancel:
				'<input type="checkbox" name="rowCheckbox" data-id="20" data-column="ship_ship_cancel" disabled/>',
		},
		{
			empty: "倉庫列表",
			id: 21,
			read: '<input type="checkbox" name="rowCheckbox" data-id="21" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="21" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="21" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="21" data-column="delete" />',
			ship_ship_requisition:
				'<input type="checkbox" name="rowCheckbox" data-id="21" data-column="ship_ship_requisition" disabled/>',
			ship_ship_approve:
				'<input type="checkbox" name="rowCheckbox" data-id="21" data-column="ship_ship_approve" disabled />',
			ship_ship_receive:
				'<input type="checkbox" name="rowCheckbox" data-id="21" data-column="ship_ship_receive" disabled />',
			ship_ship_cancel:
				'<input type="checkbox" name="rowCheckbox" data-id="21" data-column="ship_ship_cancel" disabled/>',
		},
		{
			empty: "零件資料",
			id: 22,
			read: '<input type="checkbox" name="rowCheckbox" data-id="22" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="22" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="22" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="22" data-column="delete" />',
			ship_ship_requisition:
				'<input type="checkbox" name="rowCheckbox" data-id="22" data-column="ship_ship_requisition" disabled/>',
			ship_ship_approve:
				'<input type="checkbox" name="rowCheckbox" data-id="22" data-column="ship_ship_approve" disabled/>',
			ship_ship_receive:
				'<input type="checkbox" name="rowCheckbox" data-id="22" data-column="ship_ship_receive" disabled />',
			ship_ship_cancel:
				'<input type="checkbox" name="rowCheckbox" data-id="22" data-column="ship_ship_cancel" disabled/>',
		},
		{
			empty: "入庫單列表",
			id: 23,
			read: '<input type="checkbox" name="rowCheckbox" data-id="23" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="23" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="23" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="23" data-column="delete" />',
			ship_ship_requisition:
				'<input type="checkbox" name="rowCheckbox" data-id="23" data-column="ship_ship_requisition" disabled/>',
			ship_ship_approve:
				'<input type="checkbox" name="rowCheckbox" data-id="23" data-column="ship_ship_approve" disabled/>',
			ship_ship_receive:
				'<input type="checkbox" name="rowCheckbox" data-id="23" data-column="ship_ship_receive" disabled />',
			ship_ship_cancel:
				'<input type="checkbox" name="rowCheckbox" data-id="23" data-column="ship_ship_cancel" disabled/>',
		},
		{
			empty: "入庫單",
			id: 24,
			read: '<input type="checkbox" name="rowCheckbox" data-id="24" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="24" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="24" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="24" data-column="delete" />',
			ship_ship_requisition:
				'<input type="checkbox" name="rowCheckbox" data-id="24" data-column="ship_ship_requisition" disabled/>',
			ship_ship_approve:
				'<input type="checkbox" name="rowCheckbox" data-id="24" data-column="ship_ship_approve" disabled/>',
			ship_ship_receive:
				'<input type="checkbox" name="rowCheckbox" data-id="24" data-column="ship_ship_receive" disabled />',
			ship_ship_cancel:
				'<input type="checkbox" name="rowCheckbox" data-id="24" data-column="ship_ship_cancel" disabled/>',
		},
		{
			empty: "出庫申請單列表",
			id: 25,
			read: '<input type="checkbox" name="rowCheckbox" data-id="25" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="25" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="25" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="25" data-column="delete" />',
			ship_ship_requisition:
				'<input type="checkbox" name="rowCheckbox" data-id="25" data-column="ship_ship_requisition" disabled/>',
			ship_ship_approve:
				'<input type="checkbox" name="rowCheckbox" data-id="25" data-column="ship_ship_approve" disabled/>',
			ship_ship_receive:
				'<input type="checkbox" name="rowCheckbox" data-id="25" data-column="ship_ship_receive" disabled />',
			ship_ship_cancel:
				'<input type="checkbox" name="rowCheckbox" data-id="25" data-column="ship_ship_cancel" disabled/>',
		},
		{
			empty: "出庫申請單",
			id: 26,
			read: '<input type="checkbox" name="rowCheckbox" data-id="26" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="26" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="26" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="26" data-column="delete" />',
			ship_ship_requisition:
				'<input type="checkbox" name="rowCheckbox" data-id="26" data-column="ship_ship_requisition" />',
			ship_ship_approve: '<input type="checkbox" name="rowCheckbox" data-id="26" data-column="ship_ship_approve" />',
			ship_ship_receive: '<input type="checkbox" name="rowCheckbox" data-id="26" data-column="ship_ship_receive" />',
			ship_ship_cancel: '<input type="checkbox" name="rowCheckbox" data-id="26" data-column="ship_ship_cancel" />',
		},
	];

	var columns7 = [];

	columnsData7.forEach(function (column) {
		columns7.push({ data: column.data, title: column.title });
	});

	//Data8

	var columnsData8 = [
		{ data: "empty", title: "#" },
		{ data: "read", title: "查看" },
		{ data: "insert", title: "編輯" },
		{ data: "update", title: "修改" },
		{ data: "delete", title: "刪除" },
		{ data: "cost", title: "成本" },
		{ data: "inventory_ship", title: "盤點內容盤點入庫" },
		{ data: "inventory_loss", title: "盤點內容列入盤點損失" },
	];

	var table8Data = [
		{
			empty: "盤點作業",
			id: 27,
			read: '<input type="checkbox" name="rowCheckbox" data-id="27" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="27" data-column="insert" disabled/>',
			update: '<input type="checkbox" name="rowCheckbox" data-id="27" data-column="update" disabled/>',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="27" data-column="delete" disabled/>',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="27" data-column="cost" disabled/>',
			inventory_ship: '<input type="checkbox" name="rowCheckbox" data-id="27" data-column="inventory_ship" disabled/>',
			inventory_loss: '<input type="checkbox" name="rowCheckbox" data-id="27" data-column="inventory_loss" disabled/>',
		},
		{
			empty: "盤點列表",
			id: 28,
			read: '<input type="checkbox" name="rowCheckbox" data-id="28" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="28" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="28" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="28" data-column="delete" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="28" data-column="cost" />',
			inventory_ship: '<input type="checkbox" name="rowCheckbox" data-id="28" data-column="inventory_ship" disabled/>',
			inventory_loss: '<input type="checkbox" name="rowCheckbox" data-id="28" data-column="inventory_loss" disabled/>',
		},
		{
			empty: "盤點資料",
			id: 29,
			read: '<input type="checkbox" name="rowCheckbox" data-id="29" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="29" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="29" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="29" data-column="delete" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="29" data-column="cost" />',
			inventory_ship: '<input type="checkbox" name="rowCheckbox" data-id="29" data-column="inventory_ship" />',
			inventory_loss: '<input type="checkbox" name="rowCheckbox" data-id="29" data-column="inventory_loss" />',
		},
	];

	var columns8 = [];

	columnsData8.forEach(function (column) {
		columns8.push({ data: column.data, title: column.title });
	});

	//Data9
	var columnsData9 = [
		{ data: "empty", title: "#" },
		{ data: "read", title: "查看" },
		{ data: "insert", title: "編輯" },
		{ data: "update", title: "修改" },
		{ data: "delete", title: "刪除" },
		{ data: "download", title: "零件手冊僅查詢下載" },
	];

	var table9Data = [
		{
			empty: "手冊管理",
			id: 1,
			read: '<input type="checkbox" name="rowCheckbox" data-id="1" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="1" data-column="insert" disabled/>',
			update: '<input type="checkbox" name="rowCheckbox" data-id="1" data-column="update" disabled/>',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="1" data-column="delete" disabled/>',
			download: '<input type="checkbox" name="rowCheckbox" data-id="1" data-column="download" disabled />',
		},
		{
			empty: "零件手冊列表",
			id: 2,
			read: '<input type="checkbox" name="rowCheckbox" data-id="2" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="2" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="2" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="2" data-column="delete" />',
			download: '<input type="checkbox" name="rowCheckbox" data-id="2" data-column="download" disabled />',
		},
		{
			empty: "零件手冊資料",
			id: 3,
			read: '<input type="checkbox" name="rowCheckbox" data-id="3" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="3" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="3" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="3" data-column="delete" />',
			download: '<input type="checkbox" name="rowCheckbox" data-id="3" data-column="download" />',
		},
	];

	var columns9 = [];

	columnsData9.forEach(function (column) {
		columns9.push({ data: column.data, title: column.title });
	});

	//Data10
	var columnsData10 = [
		{ data: "empty", title: "#" },
		{ data: "read", title: "查看" },
		{ data: "insert", title: "編輯" },
		{ data: "update", title: "修改" },
		{ data: "delete", title: "刪除" },
		{ data: "price", title: "訂價" },
		{ data: "wholesalePrice", title: "批發價" },
		{ data: "lowestWholesalePrice", title: "最低批發價" },
		{ data: "cost", title: "成本" },
	];

	var table10Data = [
		{
			empty: "出入庫管理",
			id: 20,
			read: '<input type="checkbox" name="rowCheckbox" data-id="20" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="20" data-column="insert" disabled/>',
			update: '<input type="checkbox" name="rowCheckbox" data-id="20" data-column="update" disabled/>',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="20" data-column="delete" disabled/>',
			price: '<input type="checkbox" name="rowCheckbox" data-id="20" data-column="price" disabled/>',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="20" data-column="wholesalePrice" disabled/>',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="20" data-column="lowestWholesalePrice" disabled/>',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="20" data-column="cost" />',
		},
		{
			empty: "倉庫清單",
			id: 21,
			read: '<input type="checkbox" name="rowCheckbox" data-id="21" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="21" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="21" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="21" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="21" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="21" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="21" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="21" data-column="cost" />',
		},
		{
			empty: "訂單報表",
			read: '<input type="checkbox" name="rowCheckbox" data-id="22" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="22" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="22" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="22" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="22" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="22" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="22" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="22" data-column="cost" />',
		},
		{
			empty: "採購單報表",
			read: '<input type="checkbox" name="rowCheckbox" data-id="23" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="23" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="23" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="23" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="23" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="23" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="23" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="23" data-column="cost" />',
		},
		{
			empty: "購物車資料",
			id: 30,
			read: '<input type="checkbox" name="rowCheckbox" data-id="30" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="30" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="30" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="30" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="30" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="30" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="30" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="30" data-column="cost" />',
		},
		{
			empty: "入庫單報表",
			id: 31,
			read: '<input type="checkbox" name="rowCheckbox" data-id="31" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="31" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="31" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="31" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="31" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="31" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="31" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="31" data-column="cost" />',
		},
		{
			empty: "出庫單報表",
			id: 32,
			read: '<input type="checkbox" name="rowCheckbox" data-id="32" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="32" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="32" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="32" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="32" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="32" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="32" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="32" data-column="cost" />',
		},
		{
			empty: "退貨單報表",
			id: 33,
			read: '<input type="checkbox" name="rowCheckbox" data-id="33" data-column="read" />',
			insert: '<input type="checkbox" name="rowCheckbox" data-id="33" data-column="insert" />',
			update: '<input type="checkbox" name="rowCheckbox" data-id="33" data-column="update" />',
			delete: '<input type="checkbox" name="rowCheckbox" data-id="33" data-column="delete" />',
			price: '<input type="checkbox" name="rowCheckbox" data-id="33" data-column="price" />',
			wholesalePrice: '<input type="checkbox" name="rowCheckbox" data-id="33" data-column="wholesalePrice" />',
			lowestWholesalePrice:
				'<input type="checkbox" name="rowCheckbox" data-id="33" data-column="lowestWholesalePrice" />',
			cost: '<input type="checkbox" name="rowCheckbox" data-id="33" data-column="cost" />',
		},
	];

	var columns10 = [];

	columnsData10.forEach(function (column) {
		columns10.push({ data: column.data, title: column.title });
	});

	// 初始
	var table1 = $("#authorize-management-1").DataTable({
		data: table1Data,
		columns: columns1,
		paging: false,
		searching: false,
		scrollX: false,
		info: false,
	});

	var table2 = $("#authorize-management-2").DataTable({
		data: table2Data,
		columns: columns2,
		paging: false,
		searching: false,
		scrollX: false,
		info: false,
	});
	var table3 = $("#authorize-management-3").DataTable({
		data: table3Data,
		columns: columns3,
		paging: false,
		searching: false,
		scrollX: false,
		info: false,
	});

	var table4 = $("#authorize-management-4").DataTable({
		data: table4Data,
		columns: columns4,
		paging: false,
		searching: false,
		scrollX: false,
		info: false,
	});
	var table5 = $("#authorize-management-5").DataTable({
		data: table5Data,
		columns: columns5,
		paging: false,
		searching: false,
		scrollX: false,
		info: false,
	});

	var table6 = $("#authorize-management-6").DataTable({
		data: table6Data,
		columns: columns6,
		paging: false,
		searching: false,
		scrollX: false,
		info: false,
	});
	var table7 = $("#authorize-management-7").DataTable({
		data: table7Data,
		columns: columns7,
		paging: false,
		searching: false,
		scrollX: false,
		info: false,
	});

	var table8 = $("#authorize-management-8").DataTable({
		data: table8Data,
		columns: columns8,
		paging: false,
		searching: false,
		scrollX: false,
		info: false,
	});
	var table9 = $("#authorize-management-9").DataTable({
		data: table9Data,
		columns: columns9,
		paging: false,
		searching: false,
		scrollX: false,
		info: false,
	});

	var table10 = $("#authorize-management-10").DataTable({
		data: table10Data,
		columns: columns10,
		paging: false,
		searching: false,
		scrollX: false,
		info: false,
	});
});

// 選取checkbox 整理打包
var jsonData;

$(document).ready(function () {
	var selectedData = {};
	// 取得的每一checkbox資料

	$('input[name="rowCheckbox"]').on("change", function () {
		var checkbox = $(this);
		var id = checkbox.closest("tr").find('input[name="rowCheckbox"]').data("id");
		var column = checkbox.data("column");

		if (typeof id !== "undefined" && typeof column !== "undefined") {
			if (checkbox.is(":checked")) {
				// 复选框被选中
				if (!selectedData[id]) {
					selectedData[id] = [];
				}
				selectedData[id].push(column);
			} else {
				// 复选框被取消选中
				if (selectedData[id]) {
					var columnIndex = selectedData[id].indexOf(column);
					if (columnIndex !== -1) {
						selectedData[id].splice(columnIndex, 1);
					}
				}
			}

			// 将选中数据组装成指定的格式
			var formattedData = {};
			for (var id in selectedData) {
				if (selectedData.hasOwnProperty(id)) {
					formattedData[id] = selectedData[id];
				}
			}

			// 使用 jQuery 将对象转换为 JSON 字符串
			jsonData = formattedData;
			console.log();
		}
	});
});

//品牌列表
$(document).ready(function () {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminBrandApi'
	// 組裝菜單所需資料
	var action = "getBrandList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminBrandApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/brand`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			const ulList = document.querySelector(".selectBrand");

			for (let i = 0; i < responseData.returnData.length; i++) {
				const brand = responseData.returnData[i];
				const brandName = brand.brandName;
				const brandId = brand.id;

				const li = document.createElement("li");
				li.classList.add("form-check");

				const input = document.createElement("input");
				input.classList.add("form-check-input");
				input.type = "checkbox";
				input.value = "";
				input.id = brandId;

				const label = document.createElement("label");
				label.classList.add("form-check-label");
				label.htmlFor = brandId;
				label.textContent = brandName;

				li.appendChild(input);
				li.appendChild(label);

				ulList.appendChild(li);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 新增
$(document).ready(function () {
	var formData = new FormData();
	var uploadForm = document.getElementById("uploadForm");

	// 添加表单提交事件监听器
	uploadForm.addEventListener("submit", function (event) {
		if (uploadForm.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
			showWarningfillFormNotification();
		} else {
			// 处理表单提交
			event.preventDefault();

			var getroleName = $("#roleName").val();
			var getstoreType = $("#storeType").val();
			var getremarkAuth = $("#remarkAuth").val();
			var getroleOrder = $("#roleOrder").val();

			console.log(getstoreType);

			var AuthDataObject = {
				authorizeName: getroleName,
				storeType: getstoreType,
				roleOrder: getroleOrder,
				remark: getremarkAuth,
			};

			// 从localStorage中获取session_id和chsm
			// 解析JSON字符串为JavaScript对象
			const jsonStringFromLocalStorage = localStorage.getItem("userData");
			const gertuserData = JSON.parse(jsonStringFromLocalStorage);
			const user_session_id = gertuserData.sessionId;

			// 组装发送文件所需数据
			// chsm = session_id+action+'HBAdminAuthorizeApi'
			var action = "insertAuthorizeDetail";
			var chsmtoPostFile = user_session_id + action + "HBAdminAuthorizeApi";
			var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

			// 设置其他formData字段
			formData.set("action", action);
			formData.set("session_id", user_session_id);
			formData.set("chsm", chsm);
			formData.set("data", JSON.stringify(AuthDataObject));
			formData.set("menuAuthorize", JSON.stringify(jsonData));
			formData.set("brandIdList", JSON.stringify(formattedString));

			// 发送文件上传请求
			$.ajax({
				type: "POST",
				url: `${apiURL}/authorize`,
				data: formData,
				processData: false,
				contentType: false,
				success: function (response) {
					if (response.returnCode === "1") {
						showSuccessFileNotification();
						var newPageUrl = "roleList.html";
						window.location.href = newPageUrl;
					} else {
						handleApiResponse(response);
					}
				},
				error: function (error) {
					console.log(error);
					showErrorNotification();
				},
			});
		}
		uploadForm.classList.add("was-validated");
	});
});

//監聽品牌複選
var formattedString;
$(document).ready(function () {
	$(".selectBrand").on("change", 'input[type="checkbox"]', function () {
		const selectedIds = [];
		// 遍历所有选中的复选框，获取其ID
		$('.selectBrand input[type="checkbox"]:checked').each(function () {
			const id = $(this).attr("id");
			if (id) {
				// 仅添加非空ID
				selectedIds.push(id);
			}
		});

		formattedString = selectedIds;
		// console.log(formattedString);
	});
});
