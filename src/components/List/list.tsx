import React, { useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Table from 'react-bootstrap/Table';
import { useHistory } from "react-router-dom";

import '../../assets/css/list.css';
import { useApi } from '../../talons/List/useApi';

const query = require("query-string");

const List: React.FC = () => {
    const talonProps = useApi();
    const history = useHistory();

    const {
        searchQuery,
        setSearchQuery,
        activePage,
        jsonRespon,
        loading
    } = talonProps;

    useEffect(() => {
       document.title = 'Items';
    }, []);

    const handlePageChange = (data) => {
        const pageNumber = data.selected;
        let parsed = query.parse(window.location.search);
        if (pageNumber) {
            parsed.p = pageNumber + 1;
        } else {
            delete parsed.p;
        }
        const params = query.stringify(parsed);
        if (params) {
            history.push('/?' + params);
        } else {
            history.push('/');
        }
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        let parsed = query.parse(window.location.search);
        if (searchQuery) {
            parsed.q = searchQuery;
            delete parsed.p;
        } else {
            delete parsed.q;
        }
        const params = query.stringify(parsed);
        if (params) {
            history.push('/?' + params);
        } else {
            history.push('/');
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    if (loading || !jsonRespon) {
        return <div className="content w-100">
            <div className="container mx-auto">
                <span>{'Loading...'}</span>
            </div>
        </div>
    };

    if (!jsonRespon.success) {
        return <div>
            {'Error'}
        </div>
    }

    return (
        <div className="content w-100">
            <div className="container mx-auto">
                <form onSubmit={handleSearchSubmit}>
                    <div className="col-md-6 px-0 float-none">
                        <div className="md-form mt-0 d-inline-block w-75">
                            <input name="search" placeholder="Enter here" className="form-control" type="text" value={searchQuery} onChange={handleSearchChange} />
                        </div>
                        <div className="md-form d-inline-block ml-2">
                            <input type="submit" className="form-control" value="Search" />
                        </div>
                    </div>
                </form>
                {jsonRespon.data.length ? (
                    <div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th className="id-column">ID</th>
                                    <th>Title</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jsonRespon.data.map(item => (
                                    <tr key={item.id}>
                                        <td className="text-center">{item.id}</td>
                                        <td>{item.title}</td>
                                    </tr>
                                ))}
                                
                            </tbody>
                        </Table>

                        <ReactPaginate
                            pageCount={jsonRespon.pageNumber}
                            pageRangeDisplayed={10}
                            marginPagesDisplayed={1}
                            previousLabel={'<'}
                            nextLabel={'>'}
                            breakLabel={'break-me'}
                            breakClassName={'break-class'}
                            breakLinkClassName={'break-link'}
                            onPageChange={handlePageChange}
                            forcePage={activePage}
                            disableInitialCallback={false}
                            containerClassName={'pagination'}
                            pageClassName={'page-li'}
                            pageLinkClassName={'page-link'}
                            activeClassName={'active'}
                            activeLinkClassName={'active'}
                            previousClassName={'previous-li'}
                            nextClassName={'next-li'}
                            previousLinkClassName={'previous-a'}
                            nextLinkClassName={'next-a'}
                            disabledClassName={'disabled'}
                            hrefBuilder={(pageIndex: number) => null}
                            extraAriaContext={'aria'}
                        />
                    </div>
                ) : (
                    <h2>{'No items'}</h2>
                )}
            </div>
        </div>
    );
}
 
export default List;