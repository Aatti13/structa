import React from 'react'

/**
 * 
 * @returns value={registrationData.password} onChange={(e)=>setSignupdata({...signUpdata, password: e.target.value})} required
 * value={registrationData.username} onChange={(e)=> setSignupdata({...signUpdata, username: e.target.value})}
 * value={registrationData.email} onChange={(e)=>setSignupdata({...signUpdata, email: e.target.value})}
 */

const RegisterPage = () => {

  const handeRegistration = (e)=>{
    e.preventDefault();
  }

  return (
    <div className='h-screen flex justify-center items-center' data-theme="dracula">
      <div className="signup-card bg-black-clr flex justify-center items-center rounded-3xl h-160 w-3xl">
        <div className='flex flex-col h-140 rounded w-2/4 b-r-left'>
          <figure className='flex items-center'>
            <img src="/images/structa logo.png" alt="logo" className='w-15 mt-6 ml-10'/>
            <span className='text-3xl mt-6'>
              Structa
            </span>
          </figure>
          <div className="w-full">
            <form onSubmit={handeRegistration}>
              <div className="space-y-4">
                <div>
                  <h2 className='mt-5 text-xl items-center ml-12'>Create an Account</h2>
                  <p className='ml-12 text-gray-500'>Join you friends and have fun!</p>
                </div>
                <div className="space-y-3">
                  <div className="form-control w-full flex flex-col">
                    <label  className="text-xs label ml-14 caret-green-500 placeholder:ml-[5px]">
                      Username
                    </label>
                    <input type="text" required placeholder='Enter Username' className='pl-2 text-input ml-12 mt-1 w-60 h-10 outline-sky-50'/>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="form-control w-full flex flex-col">
                    <label  className="text-xs label ml-14 caret-green-500 placeholder:ml-[5px]">
                      Email
                    </label>
                    <input type="text" required placeholder='Enter Email' className='pl-2 text-input ml-12 mt-1 w-60 h-10 outline-sky-50'/>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="form-control w-full flex flex-col">
                    <label  className="text-xs label ml-14 caret-green-500 placeholder:ml-[5px]">
                      Password
                    </label>
                    <input type="password" required placeholder='Enter Password' className='pl-2 text-input ml-12 mt-1 w-60 h-10 outline-sky-50'/>
                    <p className='text-xs ml-14 mt-1 text-gray-500'>Min. 6 characters</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className='ml-12 opacity-60 text-sm'>
                    <input type="checkbox" name="" id="" className='mr-2' />
                    I agree to the terms and conditions
                  </p>
                </div>
                <div className="space-y-3 mt-5 pl-10 pr-20">
                  <input type="submit" value="Register" className='w-full submit mr-25 h-10 text-center cursor-pointer b-r-left b-r-right'/>
                </div>
                <div className="space-y-2">
                  <p className='ml-12'>Already have an account? <a href='/login' >Login</a></p>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className='w-2/4 h-140 b-r-right'>
          <figure className='p-10 mt-20'>
            <img  src='/images/Secure login-amico.svg' alt='signup-img'/>
          </figure>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage