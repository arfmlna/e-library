import { CountingNumber } from '@/components/animate-ui/primitives/texts/counting-number'
import { pb } from '@/utils/pocketbase'
import { useQuery } from '@tanstack/react-query'
import { Award, Book, CircleQuestionMark, FileCheck, FileX, GraduationCap, Sparkles, UserCheck, UserCog, UserRoundCheck, Users } from 'lucide-react'
import React from 'react'

export default function Dashboard() {

  const { data: DashInfo } = useQuery({
    queryKey: ['dashboard-info'],
    queryFn: async () => {
      const res = await pb.collection('Dashboard_Infomation').getList()
      return res
    }
  })

  const iconSize = 40

  const iconList = [
    {
      id: 1,
      icon: <Users size={iconSize} className='text-5xl' />
    },
    {
      id: 2,
      icon: <UserCheck size={iconSize} className='text-5xl' />
    },
    {
      id: 3,
      icon: <UserCog size={iconSize} className='text-5xl' />
    },
    {
      id: 4,
      icon: <UserRoundCheck size={iconSize} className='text-5xl' />
    },
    {
      id: 5,
      icon: <GraduationCap size={iconSize} className='text-5xl' />
    },
    {
      id: 6,
      icon: <Award size={iconSize} className='text-5xl' />
    },
    {
      id: 7,
      icon: <Book size={iconSize} className='text-5xl' />
    },
    {
      id: 8,
      icon: <Sparkles size={iconSize} className='text-5xl' />
    },
    {
      id: 9,
      icon: <FileCheck size={iconSize} className='text-5xl' />
    },
    {
      id: 10,
      icon: <FileX size={iconSize} className='text-5xl' />
    },
  ]

  const mergeInfo = DashInfo?.items?.map((items) => {
    const iconData = iconList.find(icon => icon.id == items.id )
    return {
      ...items,
      icon: iconData ? iconData.icon : <CircleQuestionMark className='text-5xl' />
    }
  })

  return (
    <div className='w-full min-h-screen flex flex-col select-none py-5 px-5'>
        <div className="">
          <h1 className='text-4xl font-bold text-center'>
            Dashboard
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5 justify-start mt-20">
            { mergeInfo?.map((data, i) => (
              <div key={i} className="shadow hover:shadow-lg shadow-black dark:shadow-white transition-all ease-in-out duration-300 rounded-md grid grid-cols-2 gap-10 h-auto p-4 border-2 border-black dark:border-white" >
                <div className="grid grid-rows-2 items-center gap-2">
                  <div className="flex justify-center">
                    { data.icon }
                  </div>
                  <div className="text-black dark:text-white font-bold text-center">
                    {data.info}
                  </div>
                </div>
                <div className="text-black dark:text-white flex items-center justify-center">
                  <p className='text-5xl font-bold text-center'>
                    <CountingNumber number={data.jumlah} />
                  </p>
                </div>
              </div>
            )) }
          </div>
        </div>
    </div>
  )
}
