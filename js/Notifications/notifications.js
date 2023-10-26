// 登入相關提示
function showSuccessLoginNotification() {
	toastr.success("", "成功登入！");
}

function showErrorReLoginNotification() {
	toastr.error("Error", "登入過期，請重新登入");
}

function showErrorLoginNotification() {
	toastr.error("請檢查帳號、密碼是否輸入錯誤", "登入失敗，請重新登入！");
}

// 新增、修改、刪除功能提示

function showSuccessFileDeleteNotification() {
	toastr.success("", "刪除成功");
}

function showWarningContentNotification() {
	toastr.warning("請新增內容！", "提醒");
}

//上傳、下載功能
// 重新整理一次

function showSuccessFileNotification() {
	toastr.success("儲存成功，畫面將重新整理後更新！", "成功");
}

function showErrorFileNotification() {
	toastr.error("上傳失敗，請再重新操作一次", "失敗");
}

function showWarningNotification() {
	toastr.warning("請上傳檔案！", "提醒");
}

function showSuccessFileDownloadNotification() {
	toastr.success("文件已下載", "下載成功");
}
function showWarningFileNotification() {
	toastr.warning("請重新選擇檔案！", "提醒");
}

function showWarningFileNotification() {
	toastr.warning("找不到文件！", "提醒");
}

function showInfoNotification() {
	toastr.info("", "已選擇檔案");
}

function showErrorSubmitNotification() {
	toastr.error("儲存失敗", "錯誤");
}

function showWarningfillFormNotification() {
	toastr.warning("請確定填寫完整！", "提醒");
}

//購物車
function showSuccessAddToCarNotification() {
	toastr.success("請至購物車查看添加內容！", "加入成功");
}

function showSuccessAddToOrderNotification() {
	toastr.success("訂單已成立", "加入成功");
}

// 警告

function showErrorNotification() {
	toastr.error("Error", "錯誤");
}

function showErrorAuthNotification() {
	toastr.error("你沒有權限觀看此頁面", "提醒");
}
