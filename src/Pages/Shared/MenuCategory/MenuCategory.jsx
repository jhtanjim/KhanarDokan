import React from 'react'
import MenuItem from '../MenuItem/MenuItem'
import Cover from '../Cover/Cover'

const MenuCategory = ({items,title,img}) => {

  return (
    <div>
        <div className='my-8'> 
        {title&& <Cover
        title={title} 
        subtitle="Explore our wide variety of delicious food options" 
        img={img} 
        height="400px"
      />}
        </div>
      <div className=' max-w-screen-xl mx-4 lg:mx-auto grid lg:grid-cols-3 gap-4'>
     
        {
        items.map(item=><MenuItem
        key={item._id}
        item={item}
        ></MenuItem>)
        }
    </div>
    </div>
  )
}

export default MenuCategory
