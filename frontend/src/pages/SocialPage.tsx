import React from 'react';
import { useApp } from '../store/AppContext';
import { Plus, Calendar, Star, CheckCircle, Trash2, Award } from 'lucide-react';
import Avatar from '../components/Avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Primary, Surface, Success, Warning, Danger, Static, Composites } from '../theme';

const SocialPage = () => {
  const [isSocialFormOpen, setIsSocialFormOpen] = React.useState(false);
  const {
    socialSubTab,
    setSocialSubTab,
    gallery,
    setGallery,
    reviews,
    setReviews,
    testimonials,
    setTestimonials,
    currentUser,
    showToast,
  } = useApp();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold ${Surface.text[900]} tracking-tight`}>Media, Reviews & Testimonial Hub</h2>
          <p className={`text-xs ${Surface.text[500]} mt-0.5`}>Showcase success stories, collect community ratings, and view customer endorsement records.</p>
        </div>

        <Button onClick={() => setIsSocialFormOpen(!isSocialFormOpen)} className="self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5" />
          <span>
            {isSocialFormOpen 
              ? 'Hide Form' 
              : socialSubTab === 'gallery' ? 'Add Success Memory' 
              : socialSubTab === 'reviews' ? 'Submit Client Review' 
              : 'Add Endorsement'}
          </span>
        </Button>
      </div>

      <div className={`${Surface[100]} p-1 rounded-xl flex space-x-1.5 max-w-md`}>
        <button
          onClick={() => { setSocialSubTab('gallery'); setIsSocialFormOpen(false); }}
          className={`flex-1 py-2 text-center font-bold text-xs rounded-lg transition-all cursor-pointer ${
            socialSubTab === 'gallery'
              ? `${Static.white} ${Primary.text[700]} ${Surface.shadow.xs}`
              : `${Surface.text[600]} ${Surface.hover.text[900]}`
          }`}
        >
          Success Gallery ({gallery.length})
        </button>
        <button
          onClick={() => { setSocialSubTab('reviews'); setIsSocialFormOpen(false); }}
          className={`flex-1 py-2 text-center font-bold text-xs rounded-lg transition-all cursor-pointer ${
            socialSubTab === 'reviews'
              ? `${Static.white} ${Primary.text[700]} ${Surface.shadow.xs}`
              : `${Surface.text[600]} ${Surface.hover.text[900]}`
          }`}
        >
          Customer Reviews ({reviews.length})
        </button>
        <button
          onClick={() => { setSocialSubTab('testimonials'); setIsSocialFormOpen(false); }}
          className={`flex-1 py-2 text-center font-bold text-xs rounded-lg transition-all cursor-pointer ${
            socialSubTab === 'testimonials'
              ? `${Static.white} ${Primary.text[700]} ${Surface.shadow.xs}`
              : `${Surface.text[600]} ${Surface.hover.text[900]}`
          }`}
        >
          Testimonials ({testimonials.length})
        </button>
      </div>

      {isSocialFormOpen && (
        <div className={`${Static.white} p-5 rounded-2xl border ${Primary.border[100]} ${Surface.shadow.md}`}>
          {socialSubTab === 'gallery' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const title = (form.elements.namedItem('gTitle') as HTMLInputElement).value;
                const date = (form.elements.namedItem('gDate') as HTMLInputElement).value;
                const coupleName = (form.elements.namedItem('gCouple') as HTMLInputElement).value;
                const story = (form.elements.namedItem('gStory') as HTMLTextAreaElement).value;
                const imageType = (form.elements.namedItem('gImg') as HTMLSelectElement).value;

                const newItem = {
                  id: `gal-${Date.now()}`,
                  title: title,
                  imageUrl: imageType,
                  description: `${coupleName} | ${date} | ${story}`,
                  category: 'success-story'
                };
                setGallery([newItem, ...gallery]);
                setIsSocialFormOpen(false);
                showToast('Added success story photo successfully!', 'success');
              }}
              className="space-y-4"
            >
              <h3 className={`font-bold text-xs uppercase ${Primary.text[600]} tracking-wider`}>Add New Matrimonial Success Story</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className={Composites.filterLabel}>Couple Names</Label>
                  <Input name="gCouple" placeholder="e.g. Ramesh & Priya" required className={`${Surface[50]} rounded-lg`} />
                </div>
                <div className="space-y-1">
                  <Label className={Composites.filterLabel}>Wedding / Engagement Date</Label>
                  <Input name="gDate" type="date" required defaultValue="2026-06-20" className={`${Surface[50]} rounded-lg`} />
                </div>
                <div className="space-y-1">
                  <Label className={Composites.filterLabel}>Title Phrase</Label>
                  <Input name="gTitle" placeholder="e.g. A match written in the stars" required className={`${Surface[50]} rounded-lg`} />
                </div>
                <div className="space-y-1">
                  <Label className={Composites.filterLabel}>Success Photo Mockup</Label>
                  <select name="gImg" className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-2 text-xs ${Surface.text[800]} focus:outline-none focus:ring-1 ${Primary.focus.ring}`}>
                    <option value="male_1">Visual Couple Template 1</option>
                    <option value="female_1">Visual Couple Template 2</option>
                    <option value="male_2">Visual Couple Template 3</option>
                    <option value="female_2">Visual Couple Template 4</option>
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <Label className={Composites.filterLabel}>Short Success Story Caption</Label>
                  <Textarea name="gStory" placeholder="Briefly describe their match journey..." required rows={3} className={`${Surface[50]} rounded-lg`} />
                </div>
              </div>
              <div className={`flex justify-end space-x-2 border-t ${Surface.border[100]} pt-3`}>
                <Button type="button" variant="outline" size="sm" onClick={() => setIsSocialFormOpen(false)}>Cancel</Button>
                <Button type="submit" size="sm">Publish Photo Story</Button>
              </div>
            </form>
          )}

          {socialSubTab === 'reviews' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const customerName = (form.elements.namedItem('rName') as HTMLInputElement).value;
                const rating = parseInt((form.elements.namedItem('rRating') as HTMLSelectElement).value);
                const reviewText = (form.elements.namedItem('rText') as HTMLTextAreaElement).value;

                const newReview = {
                  id: `rev-${Date.now()}`,
                  customerName,
                  rating,
                  reviewText,
                  date: new Date().toISOString().split('T')[0],
                  status: 'Approved' as const
                };
                setReviews([newReview, ...reviews]);
                setIsSocialFormOpen(false);
                showToast('Review published successfully!', 'success');
              }}
              className="space-y-4"
            >
              <h3 className={`font-bold text-xs uppercase ${Primary.text[600]} tracking-wider`}>Submit Client Star Review</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className={Composites.filterLabel}>Customer / Family Name</Label>
                  <Input name="rName" placeholder="e.g. Mr. & Mrs. Parthasarathy" required className={`${Surface[50]} rounded-lg`} />
                </div>
                <div className="space-y-1">
                  <Label className={Composites.filterLabel}>Satisfaction Score</Label>
                  <select name="rRating" className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-2 text-xs ${Surface.text[800]} focus:outline-none focus:ring-1 ${Primary.focus.ring}`}>
                    <option value="5">Excellent (5 Stars)</option>
                    <option value="4">Highly Satisfied (4 Stars)</option>
                    <option value="3">Average (3 Stars)</option>
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <Label className={Composites.filterLabel}>Review Statement</Label>
                  <Textarea name="rText" placeholder="Write feedback about the matchmaking experience..." required rows={3} className={`${Surface[50]} rounded-lg`} />
                </div>
              </div>
              <div className={`flex justify-end space-x-2 border-t ${Surface.border[100]} pt-3`}>
                <Button type="button" variant="outline" size="sm" onClick={() => setIsSocialFormOpen(false)}>Cancel</Button>
                <Button type="submit" size="sm">Submit Review</Button>
              </div>
            </form>
          )}

          {socialSubTab === 'testimonials' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const author = (form.elements.namedItem('tAuthor') as HTMLInputElement).value;
                const role = (form.elements.namedItem('tRole') as HTMLInputElement).value;
                const quote = (form.elements.namedItem('tQuote') as HTMLTextAreaElement).value;
                const rating = parseInt((form.elements.namedItem('tRating') as HTMLSelectElement).value);

                const newTestimonial = {
                  id: `test-${Date.now()}`,
                  coupleName: author,
                  weddingDate: new Date().toISOString().split('T')[0],
                  story: quote,
                  imageUrl: 'default',
                  rating,
                };
                setTestimonials([newTestimonial, ...testimonials]);
                setIsSocialFormOpen(false);
                showToast('Added matrimonial testimonial endorsement!', 'success');
              }}
              className="space-y-4"
            >
              <h3 className={`font-bold text-xs uppercase ${Primary.text[600]} tracking-wider`}>Add Client Testimonial Endorsement</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className={Composites.filterLabel}>Author Name</Label>
                  <Input name="tAuthor" placeholder="e.g. Sridhar Ananthakrishnan" required className={`${Surface[50]} rounded-lg`} />
                </div>
                <div className="space-y-1">
                  <Label className={Composites.filterLabel}>City or Relationship (e.g. Bride's Father, Chennai)</Label>
                  <Input name="tRole" placeholder="e.g. Groom's Brother, Madurai" required className={`${Surface[50]} rounded-lg`} />
                </div>
                <div className="space-y-1">
                  <Label className={Composites.filterLabel}>Rating Score</Label>
                  <select name="tRating" className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-2 text-xs ${Surface.text[800]} focus:outline-none focus:ring-1 ${Primary.focus.ring}`}>
                    <option value="5">Excellent (5/5)</option>
                    <option value="4">Good (4/5)</option>
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <Label className={Composites.filterLabel}>Detailed Quote</Label>
                  <Textarea name="tQuote" placeholder="Provide full detailed story or endorsement..." required rows={3} className={`${Surface[50]} rounded-lg`} />
                </div>
              </div>
              <div className={`flex justify-end space-x-2 border-t ${Surface.border[100]} pt-3`}>
                <Button type="button" variant="outline" size="sm" onClick={() => setIsSocialFormOpen(false)}>Cancel</Button>
                <Button type="submit" size="sm">Publish Testimonial</Button>
              </div>
            </form>
          )}
        </div>
      )}

      {socialSubTab === 'gallery' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map(item => (
            <div key={item.id} className={`${Composites.card} overflow-hidden flex flex-col justify-between group`}>
              <div className={`relative h-44 ${Surface[100]} flex items-center justify-center border-b ${Surface.border[100]} overflow-hidden`}>
                <Avatar type={item.imageUrl as any} className="h-28 w-28 scale-110 group-hover:scale-120 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent flex items-end p-4">
                  <div>
                    <h4 className="font-bold text-white text-sm tracking-tight">{item.title}</h4>
                    <p className={`text-[10px] ${Primary.text[200]} mt-0.5 font-medium flex items-center space-x-1`}>
                      <Calendar className="h-3 w-3 inline shrink-0" />
                      <span>Wedded on: {item.description}</span>
                    </p>
                  </div>
                </div>
                <span className={`absolute top-3 right-3 text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${Primary[600]} ${Static.textWhite}`}>
                  Pair Tied
                </span>
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h5 className={`font-bold text-xs ${Surface.text[800]} leading-snug`}>"{item.title}"</h5>
                  <p className={`text-xs ${Surface.text[500]} leading-relaxed italic`}>
                    {item.description}
                  </p>
                </div>
                {currentUser?.role === 'Admin' && (
                  <div className={`pt-3 border-t ${Surface.border[100]} flex justify-end`}>
                    <button
                      onClick={() => {
                        setGallery(gallery.filter(g => g.id !== item.id));
                        showToast('Removed gallery photo item.', 'info');
                      }}
                      className={`p-1.5 ${Surface.text[400]} ${Danger.hover.text[600]} ${Surface.hover.bg[50]} rounded-lg transition cursor-pointer`}
                      title="Remove from success gallery"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {socialSubTab === 'reviews' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(item => (
            <div key={item.id} className={`${Composites.card} p-6 flex flex-col justify-between space-y-4`}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-bold text-sm ${Surface.text[900]}`}>{item.customerName}</h4>
                    <span className={`text-[10px] ${Surface.text[400]}`}>{item.date}</span>
                  </div>
                  <div className={`flex items-center space-x-0.5 ${Warning[50]} border ${Warning.border[100]} px-2 py-0.5 rounded-md text-[11px] font-extrabold ${Warning.text[700]}`}>
                    <Star className={`h-3 w-3 ${Warning.fill[400]} ${Warning.text[400]} shrink-0`} />
                    <span>{item.rating}.0 / 5</span>
                  </div>
                </div>
                <p className={`text-xs ${Surface.text[600]} leading-relaxed italic`}>
                  "{item.reviewText}"
                </p>
              </div>

              <div className={`flex items-center justify-between pt-3 border-t ${Surface.border[50]}`}>
                <span className={`inline-flex items-center space-x-1 text-[10px] font-extrabold ${Success.text[700]} ${Success[50]} px-2.5 py-0.5 rounded-full border ${Success.border[100]}`}>
                  <CheckCircle className={`h-3.5 w-3.5 ${Success.text[500]} shrink-0 mr-1`} />
                  <span>Verified Family Endorsement</span>
                </span>

                {currentUser?.role === 'Admin' && (
                  <button
                    onClick={() => {
                      setReviews(reviews.filter(r => r.id !== item.id));
                      showToast('Removed review.', 'info');
                    }}
                    className={`p-1.5 ${Surface.text[400]} ${Danger.hover.text[600]} ${Surface.hover.bg[50]} rounded-lg transition cursor-pointer`}
                    title="Delete review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {socialSubTab === 'testimonials' && (
        <div className="space-y-4">
          {testimonials.map(item => (
            <div key={item.id} className={`${Surface.opacity.bg_50_60} p-6 rounded-2xl border ${Surface.opacity.bd_200_60} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center space-x-2">
                  <span className={`${Primary.text[600]} font-extrabold text-xl leading-none`}>"</span>
                  <p className={`text-xs font-semibold ${Surface.text[700]} leading-relaxed italic inline`}>
                    {item.story}
                  </p>
                  <span className={`${Primary.text[600]} font-extrabold text-xl leading-none`}>"</span>
                </div>
                <div className={`flex items-center space-x-2.5 text-[11px] font-medium ${Surface.text[500]}`}>
                  <span className={`font-bold ${Surface.text[800]}`}>{item.coupleName}</span>
                  <span>•</span>
                  <span>{item.weddingDate}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <div className={`flex items-center space-x-0.5 ${Primary[50]} ${Primary.text[700]} px-2.5 py-1 rounded-lg text-xs font-bold border ${Primary.border[100]}`}>
                  <Award className={`h-4 w-4 ${Primary.text[500]} shrink-0 mr-1`} />
                  <span>{item.rating}/5 Score</span>
                </div>

                {currentUser?.role === 'Admin' && (
                  <button
                    onClick={() => {
                      setTestimonials(testimonials.filter(t => t.id !== item.id));
                      showToast('Removed testimonial endorsement.', 'info');
                    }}
                    className={`p-1.5 ${Surface.text[400]} ${Danger.hover.text[600]} ${Surface.hover.bg[50]} rounded-lg transition cursor-pointer`}
                    title="Delete testimonial"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialPage;
