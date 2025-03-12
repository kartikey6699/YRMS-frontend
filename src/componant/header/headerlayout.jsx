import { Outlet } from "react-router"

import React from 'react'
import Header from "./header"

const HeaderLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default HeaderLayout
