import { siteConfig } from "@/config/site";
import GitHubCalendar from "react-github-calendar";

export const GitHub = ({ day }: { day: boolean }) => {
    return (
        <section id="github" className={`nes-container is-rounded bg-gray-200 with-title  ${day ? "" : "is-dark"}`}>
            <p className="title"> Days I <span className="font-bold">Code</span></p>
            <GitHubCalendar
                username={siteConfig.contact.github}
                blockSize={20}
                blockMargin={7}
                fontSize={25}
                hideTotalCount
                theme={{
                    light: ['white', 'black'],
                    dark: ['gray', 'rgb(214, 16, 174)']
                }}
                colorScheme={day ? "light" : "dark"}
            />
        </section>
    );
};