import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

const query = require("query-string");

export const useApi = () => {
    const history = useHistory();
    const params = query.parse(window.location.search);

    const [loading, setLoading] = useState(true);
    const [jsonRespon, setJsonRespon] = useState([] as any);
    const [activePage, setActivePage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(params.q);

    useEffect(() => {
        fetch("https://gorest.co.in/public-api/posts").then(
            res => res.json()
        ).then(
            (result) => {
                if (result.code === 200) {
                    result.success = true;
                    const parsed = query.parse(window.location.search);
                    const { q: querySearch, p: queryPage } = parsed || {};
                    let items = result.data,
                        indexOfLastItem = 5,
                        indexOfFirstItem = 0;

                    if (querySearch) {
                        setSearchQuery(querySearch);
                        items = items.filter(function (item) {
                            return item.title.toLowerCase().includes(querySearch.toLowerCase());
                        });
                    } else {
                        setSearchQuery('');
                    }
                    result.countItems = items.length;
                    result.pageNumber = Math.ceil(items.length / 5);
                    if (parsed && Object.keys(parsed).length !== 0 && queryPage) {
                        const p = parseInt(queryPage);
                        if (p > 0) {
                            indexOfLastItem = 5 *p;
                            indexOfFirstItem = indexOfLastItem - 5;
                            setActivePage(p - 1);
                        }                        
                    } else {
                        setActivePage(0);
                    }
                    if (items.length > 1) {
                        result.data = items.slice(indexOfFirstItem, indexOfLastItem);
                    } else {
                        result.data = items;
                    }
                    setJsonRespon(result);
                }
                setLoading(false);
            },
            (error) => {
                setLoading(false);
                setJsonRespon({
                    success: false
                });
            }
        )
    }, [history.location.search]);

    return {
        searchQuery,
        setSearchQuery,
        activePage,
        jsonRespon,
        loading
    }
};