import "./styles.css";
import { useState, useEffect } from "react";
import {
  Provider,
  defaultTheme,
  Cell,
  Column,
  DatePicker,
  Grid,
  Heading,
  Item,
  Picker,
  Row,
  TableBody,
  TableHeader,
  TableView,
  Text,
  TimeField,
  View,
  Well
} from "@adobe/react-spectrum";
import { locales } from "./Locales";
import { today } from '@internationalized/date';

export default function App() {
  let [date, setDate] = useState(new Date());
  let [userDate, setUserDate] = useState(today); 
  let [userTime, setUserTime] = useState({ hour: 16, minute: 30 });
  let [dateFormatStyle, setDateFormatStyle] = useState("defaultstyle");
  let [timeFormatStyle, setTimeFormatStyle] = useState("defaultstyle");

  const defaultMargin = "5px";
  const defaultWidth = "150px";
  const maxTableWidth = "1000px";
  const tableHeight = "auto";

  const formatStyleOptions = [
    { id: "defaultstyle", name: "Default" },
    { id: "short", name: "Short" },
    { id: "medium", name: "Medium" },
    { id: "long", name: "Long" },
    { id: "full", name: "Full" },
    { id: "numeric", name: "Numeric" },
    { id: "2-digit", name: "2-Digit" }
  ];

  useEffect(() => {
    if (
      (dateFormatStyle === "numeric" || dateFormatStyle === "2-digit") &&
      (timeFormatStyle !== "numeric" && timeFormatStyle !== "2-digit" ) 
    ){
      if (timeFormatStyle !== 'defaultstyle') {
        setTimeFormatStyle("defaultstyle");
      }
    }
    else if (
      (timeFormatStyle === "numeric" || timeFormatStyle === "2-digit") &&
      (dateFormatStyle !== "numeric" && dateFormatStyle !== "2-digit") 
    ){
      if (dateFormatStyle !== 'defaultstyle') {
        setTimeFormatStyle("defaultstyle");
      }
    }
  }, [dateFormatStyle, timeFormatStyle]);

  useEffect(() => {
    if (typeof(userDate) !== 'undefined') {
      let convertedUserDate = new Date(userDate.year, userDate.month-1, userDate.day);
      setDate(convertedUserDate);
    }
  }, [userDate])

  useEffect(() => {
    if (typeof(userTime) !== 'undefined') {
      let convertedUserDate = new Date(userDate.year, 
        userDate.month-1, 
        userDate.day, 
        userTime.hour,
        userTime.minute);
      setDate(convertedUserDate);
    }
  }, [userTime])


  return (
    <div className="App">
      <Provider theme={defaultTheme}>
        <Grid
          areas={[
            'header  header',
            'pickers remarks',
            'dataTable remarks',
          ]}
          columns={['1100px', 'auto']}
          rows={['75px', '75px', 'auto']}
          height='0px'>
          <View gridArea="header">
            <Heading level={1}>Date / Time Formats</Heading>
          </View>

          <View gridArea="pickers">
            <DatePicker 
              label="Date picker"
              margin={defaultMargin}
              value={userDate}
              onChange={setUserDate}
            />

            <TimeField 
              label="Time picker"
              margin={defaultMargin}
              value={userTime}
              onChange={setUserTime}
            />
            
            <Picker
              label="Date format style"
              aria-label="date format style"
              items={formatStyleOptions}
              defaultSelectedKey={dateFormatStyle}
              selectedKey={dateFormatStyle}
              onSelectionChange={(selected) => setDateFormatStyle(selected)}
              margin={defaultMargin}
            >
              {(item) => <Item>{item.name}</Item>}
            </Picker>

            <Picker
              label="Time format style"
              aria-label="time format style"
              items={formatStyleOptions}
              defaultSelectedKey={timeFormatStyle}
              selectedKey={timeFormatStyle}
              onSelectionChange={(selected) => setTimeFormatStyle(selected)}
              margin={defaultMargin}
            >
              {(item) => <Item>{item.name}</Item>}
            </Picker>          
          </View>
          
          <View gridArea="dataTable">
          <TableView 
              aria-label="Table containing formatted data"
              density="spacious"
              maxWidth={maxTableWidth}
              height={tableHeight}
              marginTop="15px"
            >

            <TableHeader>
              <Column width={400}>Locale</Column>
              <Column>Format</Column>
            </TableHeader>
                  
            <TableBody>
              {locales.map((locale, index) => {
                let languageNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'language' });
                let regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' });
                let localeName = languageNamesInEnglish.of(new Intl.Locale(locale).language) + " (" + regionNamesInEnglish.of(new Intl.Locale(locale).region) + ")";

                let formattedDateTime = new Intl.DateTimeFormat(locale, { 
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: 'numeric',
                  minute: '2-digit'
                }).format(date);
        
                // Date and Time formats are both either Numeric or 2-Digit, so show both formats
                if (
                  (dateFormatStyle === "numeric" || dateFormatStyle === "2-digit") &&
                  (timeFormatStyle === "numeric" || timeFormatStyle === "2-digit")) {
                    formattedDateTime = new Intl.DateTimeFormat(locale, {
                      day: dateFormatStyle,
                      month: dateFormatStyle,
                      year: dateFormatStyle,
                      hour: timeFormatStyle,
                      minute: timeFormatStyle,
                      //second: timeFormatStyle
                    }).format(date);
                  }

                // Date format is either Numeric or 2-Digit, but Time format is not (so remove the latter)
                if (
                  (dateFormatStyle === "numeric" || dateFormatStyle === "2-digit") &&
                  (timeFormatStyle !== "numeric" && timeFormatStyle !== "2-digit")) {
                    formattedDateTime = new Intl.DateTimeFormat(locale, {
                      day: dateFormatStyle,
                      month: dateFormatStyle,
                      year: dateFormatStyle
                    }).format(date);
                  }

                // Time format is either Numeric or 2-Digit, but Date format is not (so remove the latter)
                if (
                  (timeFormatStyle === "numeric" || timeFormatStyle === "2-digit") &&
                  (dateFormatStyle !== "numeric" && dateFormatStyle !== "2-digit")) {
                    formattedDateTime = new Intl.DateTimeFormat(locale, {
                      hour: timeFormatStyle,
                      minute: timeFormatStyle,
                      second: timeFormatStyle
                    }).format(date);
                  }

                // Neither Date or Time formats are Numeric or 2-Digit
                if (
                  (dateFormatStyle !== "numeric" && dateFormatStyle !== "2-digit") &&
                  (timeFormatStyle !== "numeric" && timeFormatStyle !== "2-digit")){
                  if (
                    dateFormatStyle !== "defaultstyle" && timeFormatStyle !== "defaultstyle") {
                    formattedDateTime = new Intl.DateTimeFormat(locale, {
                      dateStyle: dateFormatStyle,
                      timeStyle: timeFormatStyle
                    }).format(date);
                  }

                  // 
                  if (dateFormatStyle === "defaultstyle" && timeFormatStyle !== "defaultstyle") {
                    formattedDateTime = new Intl.DateTimeFormat(locale, {
                      timeStyle: timeFormatStyle
                    }).format(date);
                  }

                  if (dateFormatStyle !== "defaultstyle" && timeFormatStyle === "defaultstyle") {
                    formattedDateTime = new Intl.DateTimeFormat(locale, {
                      dateStyle: dateFormatStyle
                    }).format(date);
                  }
                }

                return (
                    <Row>
                      <Cell className="localeColumn">{locale} · {localeName}</Cell>
                      <Cell className="dataColumn">{formattedDateTime}</Cell>
                    </Row>
                ); 
                })}
              </TableBody>
            </TableView>
        </View>

          <View gridArea="remarks">
            <Well>
              <Heading level={3}>Remarks</Heading>
              <div>Date and time samples formatted with <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat" target="_blank" rel="noreferrer">Intl.DateTimeFormat</a></div>
              <div>UI components provided by <a href="https://react-spectrum.adobe.com/react-spectrum/index.html" target="_blank" rel="noreferrer">React Spectrum</a></div>
              <br/>
              <Text>NOTE: The <b>Numeric</b> and <b>2-Digit</b> Date style options cannot be selected along with the <b>short</b>, <b>medium</b>, <b>long</b> and <b>full</b> Time options, and vice-versa. Attempting to doing so will reset the <b>Time</b> style section to "no style".</Text>

              <Heading level={4}>Decimal style</Heading>
              <Text>
              Dates and times are formatted differently across locales. Some date and time elements that are locale-dependent include:
                <ul>
                  <li>Positioning of day, month and year</li>
                  <li>Use of 12-hr vs 24-hr formats</li>
                  <li>Month and timezone names and capitalization</li>
                </ul>
              </Text>
              <br/><br/>
            </Well>
          </View>
        </Grid>
      </Provider>
    </div>
  );
}
