function App() {
    return <div className="container">
        <Popular></Popular>
    </div>
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App/>);
