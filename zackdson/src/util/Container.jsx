import React from 'react';
import PropTypes from 'prop-types';

// CenteredContainer 函数组件  
const Container = ({ children }) => {  
  return (  
    <div className="centered-container">  
      {children}  
    </div>  
  );  
};

Container.propTypes = {
  children: PropTypes.node
};

export default Container;
