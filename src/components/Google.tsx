import React from 'react'

const Google = () => {
  return (
   <>
   {/* Google Login Button */}
   <div className="flex items-center justify-center mt-3">
        <button
          id="google-login-btn"
          className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white text-black hover:text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <svg
            className="h-6 w-6 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-0.5 0 48 48"
            version="1.1"
          >
            <g fill="none" fillRule="evenodd">
              <g transform="translate(-401.000000, -860.000000)">
                <g transform="translate(401.000000, 860.000000)">
                  <path fill="#FBBC05" d="M9.827 24c0-1.524.253-2.986.705-4.356l-7.909-6.04C1.082 16.734.214 20.26.214 24c0 3.737.868 7.261 2.407 10.388l7.904-6.051C10.077 26.973 9.827 25.517 9.827 24z" />
                  <path fill="#EB4335" d="M23.714 10.133c3.311 0 6.302 1.173 8.652 3.093l6.836-6.827c-4.166-3.627-9.507-5.867-15.489-5.867C14.427.533 6.445 5.844 2.623 13.604l7.909 6.04c1.822-5.532 7.017-9.511 13.182-9.511z" />
                  <path fill="#34A853" d="M23.714 37.867c-6.165 0-11.36-3.978-13.182-9.51l-7.909 6.038c3.822 7.762 11.804 13.073 21.091 13.073 5.732 0 11.204-2.035 15.311-5.848l-7.507-5.804c-2.118 1.334-4.785 2.052-7.803 2.052z" />
                  <path fill="#4285F4" d="M46.145 24c0-1.387-.214-2.88-.535-4.267H23.714v9.067h12.604c-.63 3.091-2.345 5.468-4.8 7.015l7.507 5.805c4.314-4.004 7.12-9.969 7.12-16.62z" />
                </g>
              </g>
            </g>
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center justify-center mt-4">
        <input
          type="checkbox"
          id="remember"
          name="remember"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
          Remember me
        </label>
      </div>

      {/* OR Divider */}
      <div className="relative w-full mt-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-purple-50 px-4 text-gray-500">OR</span>
        </div>
      </div>
   </>
  )
}

export default Google
