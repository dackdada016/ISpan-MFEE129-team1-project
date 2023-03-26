import React from 'react'
import Header from '../../layouts/header'
import HeaderSearch from '../../layouts/HeaderSearch'
import { useState, useEffect } from 'react'
import { Card } from '../../template'
import { useLocation, useParams } from 'react-router-dom'
import { faCny } from '@fortawesome/free-solid-svg-icons'
import MoreSquare from '../../template/MoreSquare'
import { Link } from 'react-router-dom'

function Drinks() {
  const [searchValue, setSearchValue] = useState('');
  const [originalDrinks, setOriginalDrinks] = useState([]);
    const [drinks, setDrinks] = useState([]);
    const [filteredDrinks, setFilteredDrinks] = useState([]);

    const handleSearch = (value) => {
      setSearchValue(value); };
    // didMount
    useEffect(() => {
      const initialDrinks = ([
        {
          title: '橙色蘇打',
          subtitle: '120',
          text: '汽水',
          img: 'drinks1.jpg',
        },
        {
          title: '咖啡',
          subtitle: '120',
          text: '現磨咖啡',
          img: 'drinks2.jpg',
        },
        {
          title: '藍色蘇打',
          subtitle: '120',
          text: '汽水',
          img: 'drinks3.jpg',
        },
        {
          title: '橙色蘇打',
          subtitle: '120',
          text: '汽水',
          img: 'drinks1.jpg',
        },
        {
          title: '咖啡',
          subtitle: '120',
          text: '現磨咖啡',
          img: 'drinks2.jpg',
        },
        {
          title: '藍色蘇打',
          subtitle: '120',
          text: '汽水',
          img: 'drinks3.jpg',
        },
        
        
      ]);
      setOriginalDrinks(initialDrinks);
      setDrinks(initialDrinks);
    }, []);

    // 根据搜索框的值过滤食品数据
  useEffect(() => {
    if (searchValue) {
      const filteredDrinks = originalDrinks.filter((item) => item.title.includes(searchValue));
      setDrinks(filteredDrinks);
    } else {
      setDrinks(originalDrinks);
    }
  }, [searchValue, originalDrinks]);
  
    return (
      <>
        <Header />
      <HeaderSearch onSearch={handleSearch} />
        
        <div className="h-text-title">飲料</div>
         
        <div className="card-wrap">
          {drinks.map((item, i) => {
            const img = require(`../../img/meals/drinks/${item.img}`)
            return (
              <div className="h-card col-6" key={i}>
                <div className="h-card-left col-6">
                  <div className="h-card-header">
                    <h3 className="h-card-title">{item.title}</h3>
                    <p className="h-card-subtitle">NT.{item.subtitle}</p>
                    <p className="h-card-text">{item.text}</p>
                  </div>
                  <div className="h-card-footer">
                    <span>&#9825;</span>
                    <Link to="/MealsDetail">
                      <MoreSquare />
                    </Link>
                    
                  </div>
                </div>
                <div className="h-card-right col-7">
                  <img src={img} alt="" />
                  
                </div>
              </div>
            )
          })}
          
        </div>
      </>
    )
  }
  export default Drinks
  