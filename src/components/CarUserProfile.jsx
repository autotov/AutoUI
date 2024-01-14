import React from 'react';
import { GrEdit } from 'react-icons/gr';
import { MdOutlineCancel } from 'react-icons/md';

import { Button } from '.';
import { userProfileData } from '../data/structures';
import avatar4 from '../data/avatar4.jpg';

const CarUserProfile = (props) => {
  
  return (
    <div className="nav-item justify-end right-5 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-end items-center">
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={avatar4}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200"> ישראל ישראלי </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">  נהג הובלה   </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> israel@shop.com </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> {props.id} </p>
        </div>
      </div>
      <div>
        {userProfileData.map((item, index) => (
          <div key={index} className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400"> {item.desc} </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end top-16 " >
        <button
            type="button"
            className="text-2xl opacity-0.9 border-4 text-white hover:drop-shadow-xl rounded-full p-4" >
            <GrEdit />
        </button>
      </div>
    </div>
    

  );
};

export default CarUserProfile;
