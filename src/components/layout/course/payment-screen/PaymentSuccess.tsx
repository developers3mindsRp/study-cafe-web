import React from 'react'

const PaymentSuccess = () => {
  return (
    <div className='container max-w-3xl mx-auto  py-16 '>
<div className='border shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] py-12 rounded-[10px]'>
            <div className='text-center mx-auto'>
            <img src="/images/success.png" alt="" className='mx-auto'/>
            <h1 className='text-[40px] font-semibold'>Payment Successful!</h1>
            <p className='text-[16px] text-[#929292]'>Your payment has been processed successfully</p>
        </div>

        <div className='p-4 bg-[#F9F9FB] md:w-[650px] mx-auto space-y-4 mt-12'>
          <div className='flex justify-between'>
              <h1 className='text-[#AFAFAF]'>Transaction ID</h1><p>#4884DGYS8</p>
          </div>

          <div className='flex justify-between'>
               <h1 className='text-[#AFAFAF]'>Course</h1><p>Certification Course On Practical Filing of GSTR-9 & GSTR-9C</p>
          </div>
         

            <div className='border-t border-[#AFAFAF] '></div>

            <div className='flex justify-between'>
                  <h1 className='text-[#AFAFAF]'>Amount Paid</h1><p>₹7,559</p>
            </div>

           

        </div>

        <div className='mt-10 text-center'>
              <p className='text-[#929292] text-[20px]'>You'll be redirected automatically in <span className='text-[#09339B] font-semibold'>10 seconds.</span> <br /> Please keep this screen open. </p>
            <button className='px-32 mt-6 bg-[#34C759] hover:bg-white p-3 text-white hover:text-[#34C759] border border-[#34C759] rounded-[10px]'>Go to WhatsApp Group</button>
        </div>
</div>

       
      
    </div>
  )
}

export default PaymentSuccess
