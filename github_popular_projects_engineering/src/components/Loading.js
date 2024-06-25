import PropTypes from "prop-types";
const Loading = ({text = 'Loading'}) => (
    <div className="loading-container">
        <div className="loading">
            <i className="fa fa-spinner fa-spin"></i>
            <span className="loading-text">{text}</span>
        </div>
    </div>
);


Loading.propTypes = {
    text: PropTypes.string
};
export  default Loading;
