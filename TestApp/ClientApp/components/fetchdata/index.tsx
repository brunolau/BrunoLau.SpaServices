import Vue from 'vue';
import { Component } from 'vue-property-decorator';

interface WeatherForecast {
    dateFormatted: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

@Component
export default class FetchDataComponent extends Vue {
    forecasts: WeatherForecast[] = [];
    loading: boolean = true;

    async mounted() {
        await this.refreshData();
    }

    async refreshData() {
        this.forecasts = await this.getDataAsync();
    }

    async getDataAsync() {
        this.loading = true;
        let response = await fetch('/api/SampleData/WeatherForecasts');
        let data = response.json();
        this.loading = false;
        return data;
    }

    render(h) {
        return (
            <div>
                <h1>Weather forecast</h1>
                <p>
                    This component demonstrates fetching data from the server.
                    <button type="button" onClick={() => { this.refreshData() }}>Refresh data</button>
                </p>
               
                <br />

                {this.renderForecastsTable(h)}
            </div>
        )
    }

    renderForecastsTable(h) {
        if (!this.loading) {
            return <table class='table'>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {this.forecasts.map(forecast =>
                        <tr key={forecast.dateFormatted}>
                            <td>{forecast.dateFormatted}</td>
                            <td>{forecast.temperatureC}</td>
                            <td>{forecast.temperatureF}</td>
                            <td>{forecast.summary}</td>
                        </tr>
                    )}
                </tbody>
            </table>;
        } else {
            return <p><em>Loading...</em></p>
        }
    }
}
