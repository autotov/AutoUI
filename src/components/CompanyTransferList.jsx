import * as React from 'react';
import { useEffect } from 'react'
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

function updateIDList(companiesNames, selectedNameList, setCompanyIds) {
    let newIDList = []
   companiesNames.forEach((company) => {
        if(selectedNameList.includes(company.title)) {
            newIDList.push(company.id);
        }
    })
    console.log("selectedNameList="+selectedNameList)
    console.log("newIDList="+newIDList)
    setCompanyIds(newIDList)
}

//******************************/
export default function CompanyTransferList(props) {

    const { companyIds,  setCompanyIds} = props;

    const [checked, setChecked] = React.useState([]);

    let data = sessionStorage.getItem("userData");
    if(data == undefined || data == null || data == "" || data == "{}") {
        return <Navigate to="/login" replace />;
    }

    let companyList = [];
    let selectedCompanyList = [];
    const dataObj = JSON.parse(data);
    useEffect(() => {
        console.log("companyIds="+companyIds);
        dataObj.companiesNames.forEach((company) => {
            if(companyIds.includes(company.id)) {
                selectedCompanyList.push(company.title);
            } else {
                companyList.push(company.title);
            }
        })
        console.log("companyList="+companyList);
    }, [])

    const [left, setLeft] = React.useState(companyList);
    const [right, setRight] = React.useState(selectedCompanyList);

    useEffect(() => {
        updateIDList(dataObj.companiesNames, right, setCompanyIds)
    }, [right])

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'כל החברות נבחרו',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} נבחר`}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value.title}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value}`} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList('לא מורשה לחברות', left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="הוסף לרשימה"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="הוצא מן הרשימה"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('הרשאה לחברות', right)}</Grid>
    </Grid>
  );
}