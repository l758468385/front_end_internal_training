const {useState, useRef, useEffect} = React;
const PropTypes = PropTypes;

function Tooltip({text, children}) {
    const [hovering, setHovering] = useState(false);
    const id = useRef(null);

    const mouseOver = () => {
        clearTimeout(id.current);
        setHovering(true);
    };

    const mouseOut = () => {
        id.current = setTimeout(() => setHovering(false), 300);
    };

    return (
        <div
            onMouseOver={mouseOver}
            onMouseOut={mouseOut}
            style={{position: 'relative', display: 'inline-block'}}
        >
            {hovering === true && (
                <div className={'tooltip'} style={tooltipStyles}>
                    {text}
                </div>
            )}
            {children}
        </div>
    );
}

Tooltip.propTypes = {
    text: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
};

const tooltipStyles = {
    position: 'absolute',
    width: '160px',
    bottom: '100%',
    left: '50%',
    marginLeft: '-80px',
    borderRadius: '3px',
    backgroundColor: 'hsla(0, 0%, 20%, 0.9)',
    color: '#fff',
    textAlign: 'center',
    padding: '7px',
    marginBottom: '5px',
    fontSize: '14px',
};

window.Tooltip = Tooltip;
