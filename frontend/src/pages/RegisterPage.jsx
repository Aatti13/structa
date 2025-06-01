import React from 'react'

const RegisterPage = () => {

  const handeRegistration = (e)=>{
    e.preventDefault();
  }

  return (
    <div className='h-screen flex justify-center items-center' data-theme="dracula">
      <div className="signup-card bg-black-clr flex justify-center items-center rounded-3xl h-140 w-3xl">
        <div className='flex flex-col h-140 rounded w-2/4 b-r-left'>
          <figure className='flex items-center'>
            <img src="/images/structa logo.png" alt="logo" className='w-15 mt-9 ml-10'/>
            <span className='text-3xl mt-9'>
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
                    <label  className="label ml-12 caret-green-500 placeholder:ml-[5px]">
                      Username
                    </label>
                    <input type="text" value={signUpdata.username} onChange={(e)=> setSignupdata({...signUpdata, username: e.target.value})} required placeholder='Enter Username' className=' text-input ml-12 mt-1 w-60 h-10 outline-sky-50'/>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="form-control w-full flex flex-col">
                    <label  className="label ml-12 caret-green-500 placeholder:ml-[5px]">
                      Email
                    </label>
                    <input type="text" value={signUpdata.email} onChange={(e)=>setSignupdata({...signUpdata, email: e.target.value})} required placeholder='Enter Email' className='text-input ml-12 mt-1 w-60 h-10 outline-sky-50'/>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="form-control w-full flex flex-col">
                    <label  className="label ml-12 caret-green-500 placeholder:ml-[5px]">
                      Password
                    </label>
                    <input type="text" value={signUpdata.password} onChange={(e)=>setSignupdata({...signUpdata, password: e.target.value})} required placeholder='Enter Password' className='text-input ml-12 mt-1 w-60 h-10 outline-sky-50'/>
                    <p className='ml-12 text-gray-500'>Join you friends and have fun!</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className='h-140 w-2/4 b-r-right'>
          <figure className='p-10 mt-20'>
            <img  src='/images/Secure login-amico.svg' alt='signup-img'/>
          </figure>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage