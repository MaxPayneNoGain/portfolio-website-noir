"use client"

import { useEffect, useState } from "react"
import { Old_Standard_TT, PT_Serif, UnifrakturMaguntia } from "next/font/google"
import "./front-page.css"

const masthead = UnifrakturMaguntia({ subsets: ["latin"], weight: "400", variable: "--np-mast" })
const headline = Old_Standard_TT({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"], variable: "--np-head" })
const body = PT_Serif({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"], variable: "--np-body" })

const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]

function useIssueDate() {
  const [date, setDate] = useState("")
  useEffect(() => {
    const d = new Date()
    setDate(`${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`)
  }, [])
  return date
}

export function FrontPage() {
  const date = useIssueDate()

  return (
    <section id="about" className="r-section">
      <article className={`np ${masthead.variable} ${headline.variable} ${body.variable}`}>
        <div className="np__sky">
          <span>
            <b>INSIDE:</b> How a newsroom app gets made, <i>3A</i>
          </span>
          <span>
            <b>SPORTS:</b> The Premier League, by the numbers, <i>1B</i>
          </span>
        </div>

        <header className="np__top">
          <div className="np__ear">
            <b>Late City Edition</b>
            <span>Final</span>
          </div>
          <h2 className="np__mast">The RHCJC</h2>
          <div className="np__ear np__ear--right">
            <b>Weather</b>
            <span>Rain tonight, low 61.</span>
            <span>Clearing Sunday, high 78.</span>
          </div>
        </header>

        <div className="np__folio">
          <span>VOL. XCVII . . . No. 290</span>
          <span>HATTIESBURG, MISSISSIPPI{date && `, ${date}`}</span>
          <span>35 CENTS</span>
        </div>

        <div className="np__page">
          <div className="np__lead">
            <h3 className="np__headline">Meet the Southern Miss Student Writing Code for a Hattiesburg Newsroom</h3>
            <p className="np__deck">
              Nick Sharma splits his days between class, the newsroom and a growing list of projects of his own
            </p>

            <div className="np__lead-body">
              <figure className="np__photo">
                <img src="/images/headshot.jpg" alt="Nick Sharma" />
                <div className="np__credit">STAFF PHOTO</div>
                <figcaption>Nick Sharma, 3.97 GPA, Class of 2027.</figcaption>
              </figure>

              <div className="np__story">
                <p className="np__byline">
                  By THE RHCJC STAFF
                </p>
                <p>
                  <b>HATTIESBURG</b>&nbsp;—&nbsp;Most mornings, Nick Sharma is in class at the University of Southern
                  Mississippi. Most afternoons, he is at the Roy Howard Community Journalism Center, working on the
                  software that helps the newsroom get its stories out.
                </p>
                <p>
                  Sharma, a computer science major with minors in business and mathematics, joined the center in May.
                  Since then he has helped launch its mobile app and built tools that take some of the routine work off
                  the staff&apos;s plate.
                </p>
                <p>
                  Sharma doesn&apos;t see much of a line between the code and the business around it. He is as likely
                  to be reading about how a company makes its money as he is to be reading documentation, and he
                  usually has opinions about both.
                </p>
                <p>
                  Data is where those interests meet. Hand him a spreadsheet and he wants to know what story the
                  numbers are telling, then build something that tells it better. It is the same instinct whether the
                  subject is a newsroom&apos;s readers, a balance sheet or a league table.
                </p>
                <p>
                  He wrote his first production code as an intern in Kathmandu, Nepal, nearly 8,000 miles from
                  Hattiesburg. He is on track to graduate in May 2027.
                </p>
                <p className="np__jump">See SHARMA, Page 4A</p>
              </div>
            </div>
          </div>

          <aside className="np__rail">
            <div className="np__brief">
              <h4>Windows 95 Goes on Sale at Midnight</h4>
              <p>
                <b>REDMOND</b>&nbsp;—&nbsp;Microsoft&apos;s Windows 95 went on sale Thursday, with some stores opening at
                midnight for the lines outside. The company is backing the launch with a campaign set to the Rolling
                Stones&apos; &ldquo;Start Me Up.&rdquo;
              </p>
            </div>
            <div className="np__brief">
              <h4>&lsquo;Titanic&rsquo; Ties Record With 11 Oscars</h4>
              <p>
                <b>LOS ANGELES</b>&nbsp;—&nbsp;&ldquo;Titanic&rdquo; won 11 Academy Awards on Monday night, including best
                picture and best director for James Cameron, tying the record set by &ldquo;Ben-Hur.&rdquo;
              </p>
            </div>
            <div className="np__brief">
              <h4>Nintendo 64 Hits Stores</h4>
              <p>
                Nintendo&apos;s new 64-bit console arrived in U.S. stores Sunday at $199.99, alongside &ldquo;Super
                Mario 64.&rdquo; Many retailers sold out of their first shipments.
              </p>
            </div>
            <div className="np__index">
              <b>INDEX</b>
              <span>Business</span>
              <span>5A</span>
              <span>Finance</span>
              <span>6A</span>
              <span>Stocks</span>
              <span>7A</span>
              <span>Tech</span>
              <span>8A</span>
              <span>Sports</span>
              <span>1B</span>
              <span>Soccer</span>
              <span>2B</span>
              <span>MMA</span>
              <span>4B</span>
              <span>Movies</span>
              <span>1C</span>
              <span>Classified</span>
              <span>5C</span>
            </div>
          </aside>
        </div>

        <div className="np__fold" aria-hidden="true" />

        <div className="np__below">
          <div className="np__box">
            <h4>Stocks</h4>
            <table className="np__table np__table--stocks">
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Last</th>
                  <th>Chg</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Apple</td>
                  <td>22.88</td>
                  <td>-0.38</td>
                </tr>
                <tr>
                  <td>Coca-Cola</td>
                  <td>50.25</td>
                  <td>+0.50</td>
                </tr>
                <tr>
                  <td>IBM</td>
                  <td>124.13</td>
                  <td>+1.13</td>
                </tr>
                <tr>
                  <td>Microsoft</td>
                  <td>131.38</td>
                  <td>+1.88</td>
                </tr>
                <tr>
                  <td>Nike</td>
                  <td>120.75</td>
                  <td>-0.63</td>
                </tr>
              </tbody>
            </table>
            <p className="np__dow">Dow Jones industrials 5,872.38, up 12.04</p>
          </div>

          <div className="np__box">
            <h4>Top Rentals This Week</h4>
            <ol className="np__list">
              <li>Back to the Future</li>
              <li>Jurassic Park</li>
              <li>The Matrix</li>
              <li>Rocky IV</li>
              <li>Home Alone</li>
            </ol>
          </div>

          <div className="np__box">
            <h4>TV Tonight</h4>
            <table className="np__table np__table--tv">
              <tbody>
                <tr>
                  <td>7:00</td>
                  <td>Wheel of Fortune</td>
                </tr>
                <tr>
                  <td>7:30</td>
                  <td>Saved by the Bell</td>
                </tr>
                <tr>
                  <td>8:00</td>
                  <td>The X-Files</td>
                </tr>
                <tr>
                  <td>9:00</td>
                  <td>Pro Wrestling</td>
                </tr>
                <tr>
                  <td>10:00</td>
                  <td>Late News</td>
                </tr>
                <tr>
                  <td>10:35</td>
                  <td>Saturday Night Live</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="np__box np__classifieds">
            <h4>Classifieds</h4>
            <p>
              <b>FOR SALE:</b> Sega Genesis, two controllers, six games. $60 OBO.
            </p>
            <p>
              <b>LOST:</b> Tamagotchi, answers to &ldquo;Tama.&rdquo; Has not been fed since Tuesday.
            </p>
            <p>
              <b>WANTED:</b> Someone to tape the game Sunday. Will supply VHS.
            </p>
            <p>
              <b>FREE:</b> 1,000 internet trial CDs. Make good coasters.
            </p>
          </div>

          <div className="np__box np__stars">
            <h4>Your Horoscope</h4>
            <p>
              <b>ARIES</b> <i>(March 21-April 19)</i>: A conversation you have been putting off goes better than expected. Say what you mean.
            </p>
            <p>
              <b>TAURUS</b> <i>(April 20-May 20)</i>: Money matters need a second look. Hold off on big purchases until Thursday.
            </p>
            <p>
              <b>GEMINI</b> <i>(May 21-June 20)</i>: An old friend gets in touch. Make time; it will be worth it.
            </p>
            <p>
              <b>CANCER</b> <i>(June 21-July 22)</i>: Home is your focus this week. A small project pays off.
            </p>
            <p>
              <b>LEO</b> <i>(July 23-Aug. 22)</i>: Your ideas get noticed at work. Be ready to back them up.
            </p>
            <p>
              <b>VIRGO</b> <i>(Aug. 23-Sept. 22)</i>: Details matter today. Read it twice before you sign anything.
            </p>
            <p>
              <b>LIBRA</b> <i>(Sept. 23-Oct. 22)</i>: A partner sees things differently. Listen before you decide.
            </p>
            <p>
              <b>SCORPIO</b> <i>(Oct. 23-Nov. 21)</i>: Trust your instincts on a new offer, but ask questions first.
            </p>
            <p>
              <b>SAGITTARIUS</b> <i>(Nov. 22-Dec. 21)</i>: Travel plans shift. Stay flexible and keep your sense of humor.
            </p>
            <p>
              <b>CAPRICORN</b> <i>(Dec. 22-Jan. 19)</i>: Hard work from earlier in the month starts to show. Keep going.
            </p>
            <p>
              <b>AQUARIUS</b> <i>(Jan. 20-Feb. 18)</i>: A new interest takes up more of your time than planned. Enjoy it.
            </p>
            <p>
              <b>PISCES</b> <i>(Feb. 19-March 20)</i>: Rest is not a waste of time. Take the evening off.
            </p>
          </div>

          <div className="np__ad np__ad--video">
            <div className="np__ad-store">VIDEO BARN</div>
            <div className="np__ad-big">NEW RELEASES $2.99</div>
            <p>2-night rentals. 3 old favorites for $5.</p>
            <div className="np__ad-sticker">BE KIND, PLEASE REWIND</div>
          </div>

          <div className="np__ad np__ad--online">
            <div className="np__ad-big">GET ONLINE!</div>
            <p>56K dial-up · E-mail · The World Wide Web</p>
            <div className="np__ad-price">100 FREE HOURS</div>
            <div className="np__ad-store">HUB CITY NET · Call today</div>
          </div>

          <div className="np__ad np__ad--pizza">
            <div className="np__scissors" aria-hidden="true">
              ✂
            </div>
            <div className="np__ad-store">GUS&apos;S PIZZA</div>
            <div className="np__ad-big">LARGE 1-TOPPING</div>
            <div className="np__ad-price">$6.99</div>
            <p>Carryout or delivered. Add a 2-liter for 99¢.</p>
            <div className="np__coupon">
              Not valid with any other offer. Customer pays sales tax. Limited delivery area. Our drivers carry less
              than $20. Expires Sunday.
            </div>
          </div>
        </div>
      </article>
    </section>
  )
}
