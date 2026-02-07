import React from 'react';

const FeaturedServices = () => {
  return (
    <>
      <section className="overview-area ptb-100 pt-0">
        <div className="container">
          {/* Feature One */}
          <div className="overview-box">
            <div className="overview-content">
              <div className="content">
                <h2 className="text-primary">Proven Methodology</h2>
                <p>
                  There are over 1000 teachers for 20 Subjects to choose from.
                  All teachers in our online tutoring have been checked for
                  their qualifications and trained by us.
                </p>
                <p>
                  All the methods and processes are proven to help students
                  learn faster.
                </p>
              </div>
            </div>

            <div className="overview-image">
              <div className="image">
                <img
                  src="/images/features-image/Methodology-2.png"
                  alt="image"
                />
              </div>
            </div>
          </div>

          {/* Feature Two */}
          <div className="overview-box">
            <div className="overview-image">
              <div className="image">
                <img
                  src="/images/features-image/Optimal Learning-1.png"
                  alt="image"
                />
              </div>
            </div>

            <div className="overview-content">
              <div className="content right-content">
                <h2 className="text-primary">Effective Learning</h2>
                <p>
                  Doubtlet believes in providing impactful education and
                  therefore our teacher-student interactions are structured to
                  encourage and promote the learner’s understanding of the
                  subject matter. We regularly seek feedback from students to
                  know how the knowledge provided matches up with their
                  expectations. Our feedback system, that is timely, detailed
                  and constructive, assists in delivering effective learning.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Three */}
          <div className="overview-box">
            <div className="overview-content">
              <div className="content">
                <h2 className="text-primary">
                  Supportive Culture(24x7 Support)
                </h2>
                <p>
                  Students can reach out to us at any time of the day, any day
                  of the week/month/year. A tutor is immediately assigned to the
                  query raised to make sure that solution is delivered to you in
                  no time. Our dedicated tutors are always happy to assist you
                  with your queries, be it technical or otherwise – so you don’t
                  have to wait!
                </p>
              </div>
            </div>

            <div className="overview-image">
              <div className="image">
                <img
                  src="/images/features-image/Flexible Timing-2.png"
                  alt="image"
                />
              </div>
            </div>
          </div>

          {/* Feature Four */}
          <div className="overview-box">
            <div className="overview-image">
              <div className="image">
                <img
                  src="/images/features-image/Study-Material-2.png"
                  alt="image"
                />
              </div>
            </div>

            <div className="overview-content">
              <div className="content right-content">
                <h2 className="text-primary">
                  Flexible and Convenient Learning
                </h2>
                <p>
                  We believe that each student has an individual personality,
                  different educational needs and unique milestones and what may
                  work well with one type of student, might not work well with
                  another student. Therefore, our teaching team is equipped with
                  different teaching styles which enables them to adjust to meet
                  the individual needs of each student. This makes our teaching
                  flexible and convenient.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Five */}
          <div className="overview-box">
            <div className="overview-content">
              <div className="content">
                <h2 className="text-primary">Expert Teaching Team</h2>
                <p>
                  At Doubtlet we have a team of about 1000 highly skilled
                  tutors, teaching over 20 subjects and each one is an expert in
                  his/her field. Before hiring a tutor, a thorough examination
                  is done, so that learning is not compromised at any cost.
                  Teacher performance is continuously reviewed and their skills
                  are upgraded to keep them equipped with the latest and the
                  best teaching resources available.
                </p>
              </div>
            </div>

            <div className="overview-image">
              <div className="image">
                <img
                  src="/images/features-image/Online Tests.png"
                  alt="image"
                />
              </div>
            </div>
          </div>

          {/* Feature Six */}
          <div className="overview-box">
            <div className="overview-image">
              <div className="image">
                <img
                  src="/images/features-image/Fee-Structure-2.png"
                  alt="image"
                />
              </div>
            </div>

            <div className="overview-content">
              <div className="content right-content">
                <h2 className="text-primary">Transparent Fees Structure</h2>
                <p>
                  We provide the best services at very affordable costs. The fee
                  structure is made fully transparent . We believe in running a
                  business based on ethics and trust, thus, there are no long
                  term contacts or hidden costs involved. The assurance of
                  tuition is given by Doublet and money will only be charged
                  when a service is delivered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedServices;
