import { withRouter } from 'next/router'
import green from "@material-ui/core/colors/green";

const ActiveLink = ({ router, href, children }) => {

  (function preFetchPages() {
    if(typeof window !== undefined) {
      //Best works in production
      router.prefetch(router.pathname)
    }

  })() //Creating it as an ify calling the function right away by wrapping it int parentheses


  const handleClick = event => {
    event.preventDefault();
    router.push(href);
  }
  const isCurrentPath = router.pathname === href || router.asPath === href;

  return<div>
    <a 
      href={href} 
      onClick={handleClick} 
      style={
        {
          textDecoration:'none', 
          margin:'0', 
          padding:'0', 
          fontWeight: isCurrentPath ? "bold" : "normal",
          color: isCurrentPath ? "black" : '#fff'
        }}>
      {children}
    </a>
  </div>;
};

export default withRouter(ActiveLink);
