const loadingOverlay = document.getElementById("loading-overlay")

export const showLoading = () => loadingOverlay?.classList.add("is-visible")

export const hideLoading = () => loadingOverlay?.classList.remove("is-visible")
