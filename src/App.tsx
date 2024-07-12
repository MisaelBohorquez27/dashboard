import "./App.css";
import { useEffect, useState } from 'react';
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Indicator from './components/Indicator';
import Summary from './components/Summary';
import BasicTable from './components/BasicTable';
import WeatherChart from './components/WeatherChart';
import ControlPanel from './components/ControlPanel';

interface Row {
  rangeHours: string;
  windDirection: string;
}

function App() {

  // Variable de estado y función de actualización
  const [indicators, setIndicators] = useState<JSX.Element[]>([]);
  const [rowsTable, setRowsTable] = useState<Row[]>([]);

  // Hook: useEffect
  useEffect(() => {
    const fetchData = async () => {
      // 1. Comente el código anterior con el Request

      // let API_KEY = "AQUÍ VA SU API KEY DE OPENWEATHERMAP"
      // let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
      // let savedTextXML = await response.text();

      // 2. Del LocalStorage, obtiene el valor de las claves openWeatherMap y expiringTime
      let savedTextXML = localStorage.getItem("openWeatherMap");
      let expiringTime = localStorage.getItem("expiringTime");

      // 3. Obtenga la estampa de tiempo actual
      let nowTime = (new Date()).getTime();

      // 4. Realiza la petición asicrónica cuando:
      // (1) La estampa de tiempo de expiración (expiringTime) es nula, o
      // (2) La estampa de tiempo actual es mayor al tiempo de expiración
      if (expiringTime === null || nowTime > parseInt(expiringTime)) {
        // 5. Request
        let API_KEY = "fd18d780f36af7965ddeaf2152cf6502";
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
        savedTextXML = await response.text();

        // 6. Diferencia de tiempo
        let hours = 1;
        let delay = hours * 3600000;

        // 7. En el LocalStorage, almacena texto en la clave openWeatherMap y la estampa de tiempo de expiración
        localStorage.setItem("openWeatherMap", savedTextXML);
        localStorage.setItem("expiringTime", (nowTime + delay).toString());
      }

      // XML Parser
      const parser = new DOMParser();
      const xml = parser.parseFromString(savedTextXML || "", "application/xml");

      // Arreglo para agregar los resultados
      let dataToIndicators: Array<[string, string, string]> = [];

      // Análisis, extracción y almacenamiento del contenido del XML en el arreglo de resultados
      let location = xml.getElementsByTagName("location")[1];

      let geobaseid = location?.getAttribute("geobaseid") || "N/A";
      dataToIndicators.push(["Location", "geobaseid", geobaseid]);

      let latitude = location?.getAttribute("latitude") || "N/A";
      dataToIndicators.push(["Location", "Latitude", latitude]);

      let longitude = location?.getAttribute("longitude") || "N/A";
      dataToIndicators.push(["Location", "Longitude", longitude]);

      // Renderice el arreglo de resultados en un arreglo de elementos Indicator
      let indicatorsElements = dataToIndicators.map((element, index) => (
        <Indicator key={index} title={element[0] || ""} subtitle={element[1] || ""} value={parseFloat(element[2]) || 0} />
      ));

      // Modificación de la variable de estado mediante la función de actualización
      setIndicators(indicatorsElements);

      // 2. Procese los resultados de acuerdo con el diseño anterior.
      // Revise la estructura del documento XML para extraer los datos necesarios.
      let arrayObjects = Array.from(xml.getElementsByTagName("time")).map((timeElement) => {
        let rangeHours = (timeElement.getAttribute("from") || "").split("T")[1] + " - " + (timeElement.getAttribute("to") || "").split("T")[1];
        let windDirection = (timeElement.getElementsByTagName("windDirection")[0].getAttribute("deg") || "") + " " + (timeElement.getElementsByTagName("windDirection")[0].getAttribute("code") || "");
        return { rangeHours: rangeHours, windDirection: windDirection };
      });

      arrayObjects = arrayObjects.slice(0, 8);

      // 3. Actualice de la variable de estado mediante la función de actualización
      setRowsTable(arrayObjects);
    };

    fetchData();
  }, []);

  // JSX
  return (
    <Grid container spacing={5}>
      <Grid xs={6} lg={2}>
        {indicators[0]}
        {/* <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} /> */}
      </Grid>

      <Grid xs={6} lg={2}>
        {indicators[1]}
        {/* <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} /> */}
      </Grid>

      <Grid xs={6} lg={2}>
        {indicators[2]}
        {/* <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} /> */}
      </Grid>

      <Grid xs={6} md={4} lg={2}>
        <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} />
      </Grid>

      <Grid xs={6} sm={4} md={3} lg={2}>
        <Summary />
      </Grid>

      <Grid xs={12} md={6} lg={9}>
        <BasicTable rows={rowsTable} />
      </Grid>

      <Grid xs={12} lg={2}>
        <ControlPanel />
      </Grid>

      <Grid xs={12} lg={10}>
        <WeatherChart />
      </Grid>
    </Grid>
  );
}

export default App;
