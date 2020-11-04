// Success & error handlers
function handleSuccess(data) {
  return {
    status: 'success',
    body: data
  }
}

function handleError(error) {
  return {
    status: 'error',
    message: error
  }
}

module.exports = {
  handleSuccess: handleSuccess,
  handleError: handleError
}