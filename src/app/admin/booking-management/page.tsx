'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

export default function BookingManagementPage() {

  const [bookings,setBookings]=useState<any[]>([])
  const [filtered,setFiltered]=useState<any[]>([])
  const [loading,setLoading]=useState(true)
  const [search,setSearch]=useState('')
  const [status,setStatus]=useState('')

  useEffect(()=>{

    loadBookings()

  },[])


  async function loadBookings(){

    setLoading(true)

    const {data,error}=await supabase
      .from('bookings')
      .select(`
        *,
        users(
          username
        ),
        rooms(
          name
        )
      `)
      .order(
        'created_at',
        {
          ascending:false
        }
      )

    console.log(
      'BOOKINGS:',
      data
    )

    console.log(
      'ERROR:',
      error
    )

    if(data){

      setBookings(data)

      setFiltered(data)

    }

    setLoading(false)

  }


  useEffect(()=>{

    let result=[...bookings]

    if(status){

      result=result.filter(
        b=>b.status===status
      )

    }

    if(search){

      result=result.filter(

        b=>

        b.rooms?.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

        ||

        b.users?.username
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

      )

    }

    setFiltered(result)

  },[
    search,
    status,
    bookings
  ])



  async function updateStatus(
    id:string,
    newStatus:string
  ){

    const {error}=await supabase
      .from('bookings')
      .update({

        status:newStatus

      })
      .eq(
        'id',
        id
      )

    if(error){

      alert(
        error.message
      )

      return

    }

    loadBookings()

  }



  return(

    <div className="flex h-screen overflow-hidden">

      <Sidebar/>

      <div className="flex-1 flex flex-col overflow-hidden">

        <Navbar
          title="Booking Management"
        />

        <main className="
        flex-1
        overflow-y-auto
        p-6
        ">

          <h1 className="
          text-3xl
          font-bold
          mb-8
          ">
            Booking Management
          </h1>


          <div className="
          flex
          gap-4
          mb-6
          ">

            <input
              placeholder="
              Search bookings...
              "
              value={search}
              onChange={e=>
                setSearch(
                  e.target.value
                )
              }
              className="
              flex-1
              border
              rounded-xl
              px-4
              py-3
              "
            />


            <select
              value={status}
              onChange={e=>
                setStatus(
                  e.target.value
                )
              }
              className="
              border
              rounded-xl
              px-4
              py-3
              "
            >

              <option value="">
                All Statuses
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="cancelled">
                Cancelled
              </option>

              <option value="completed">
                Completed
              </option>

            </select>

          </div>


          <div className="
          bg-white
          border
          rounded-2xl
          overflow-hidden
          ">

            <table className="
            w-full
            ">

              <thead className="
              border-b
              text-gray-500
              ">

                <tr>

                  <th className="
                  text-left
                  p-4
                  ">
                    USER
                  </th>

                  <th className="
                  text-left
                  p-4
                  ">
                    ROOM
                  </th>

                  <th className="
                  text-left
                  p-4
                  ">
                    TITLE
                  </th>

                  <th className="
                  text-left
                  p-4
                  ">
                    DATE
                  </th>

                  <th className="
                  text-left
                  p-4
                  ">
                    TIME
                  </th>

                  <th className="
                  text-left
                  p-4
                  ">
                    STATUS
                  </th>

                  <th className="
                  text-left
                  p-4
                  ">
                    ACTIONS
                  </th>

                </tr>

              </thead>


              <tbody>

                {loading && (

                  <tr>

                    <td
                      colSpan={7}
                      className="
                      p-10
                      text-center
                      "
                    >

                      Loading...

                    </td>

                  </tr>

                )}


                {!loading &&
                filtered.length===0 && (

                  <tr>

                    <td
                      colSpan={7}
                      className="
                      p-10
                      text-center
                      text-gray-400
                      "
                    >

                      No bookings found.

                    </td>

                  </tr>

                )}



                {filtered.map(b=>(

                  <tr
                    key={b.id}
                    className="
                    border-t
                    "
                  >

                    <td className="p-4">

                      {
                        b.users
                        ?.username
                        ??
                        '—'
                      }

                    </td>

                    <td className="p-4">

                      {
                        b.rooms
                        ?.name
                        ??
                        '—'
                      }

                    </td>

                    <td className="p-4">

                      {
                        b.title
                      }

                    </td>

                    <td className="p-4">

                      {
                        b.booking_date
                      }

                    </td>

                    <td className="p-4">

                      {
                        b.start_time
                      }

                      -

                      {
                        b.end_time
                      }

                    </td>


                    <td className="p-4">

                      <span
                        className="
                        px-3
                        py-1
                        rounded-full
                        bg-gray-100
                        "
                      >

                        {
                          b.status
                        }

                      </span>

                    </td>


                    <td className="
                    p-4
                    flex
                    gap-2
                    ">

                      <button
                        onClick={()=>
                          updateStatus(
                            b.id,
                            'approved'
                          )
                        }
                        className="
                        px-3
                        py-1
                        rounded
                        bg-green-600
                        text-white
                        "
                      >
                        Approve
                      </button>


                      <button
                        onClick={()=>
                          updateStatus(
                            b.id,
                            'cancelled'
                          )
                        }
                        className="
                        px-3
                        py-1
                        rounded
                        bg-red-600
                        text-white
                        "
                      >
                        Reject
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </main>

      </div>

    </div>

  )

}
