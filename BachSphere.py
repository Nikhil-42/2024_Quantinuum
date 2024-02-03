from music21 import pitch, interval, note
import copy
def major_scale(tonic: pitch.Pitch): #-> list[pitch.Pitch]:
    '''
    Given a tonic pitch.Pitch(), return a list of music21 pitch.Pitch 
    objects that form one octave of a major scale above that pitch,
    including the tonic pitch at the beginning and the tonic pitch up an octave at the end.

    (this is an example of a complete or nearly-complete docstring
    that does not need to be filled in.)
    '''
    tonic = tonic
    supertonic = copy.deepcopy(tonic).transpose(interval.Interval('M2'))
    mediant = copy.deepcopy(tonic).transpose(interval.Interval('M3'))
    subdominant = copy.deepcopy(tonic).transpose(interval.Interval('P4'))
    dominant = copy.deepcopy(tonic).transpose(interval.Interval('P5'))
    submediant = copy.deepcopy(tonic).transpose(interval.Interval('M6'))
    leading_tone = copy.deepcopy(tonic).transpose(interval.Interval('M7'))
    octave = copy.deepcopy(tonic).transpose(interval.Interval('P8'))
    return [tonic, supertonic, mediant, subdominant, dominant, submediant, leading_tone, octave]
major_scale(pitch.Pitch('B--4'))
from itertools import permutations
def root(pitch_list) -> pitch.Pitch:
    '''
    Given a list of pitches which represent a triad, returns the pitch 
    that represents the root of the triad.
    
    The pitches represent a complete triad, so there are at least 3 pitches.
    
    The list of pitches is assumed to be sorted from lowest to highest.  
    But it is not necessarily in closed position nor are duplicate
    named pitches removed.
    
    The root can be in any octave.
    '''
    remove_dup = list(set(x.name for x in pitch_list))
    ints = []
    for perm in list(permutations(remove_dup, r=2)):
        ints.append(interval.Interval(pitchStart = p(perm[0]), pitchEnd = p(perm[1])))
        t1 = p(perm[1])
        t1.octave = 3
        ints.append(interval.Interval(pitchStart = t1, pitchEnd = p(perm[0])))
    options = []
    size = None
    for i in ints:
        if i.name == interval.Interval('P5').name:
            options = [i.noteStart, i.noteEnd]
            size = interval.Interval('P5').name
            break
        elif i.name == interval.Interval('A5').name:
            options = [i.noteStart, i.noteEnd]
            size = interval.Interval('A5').name
            break
        elif i.name == interval.Interval('d5').name:
            options = [i.noteStart, i.noteEnd]
            size = interval.Interval('d5').name
            break
    if size =='A5':
        check =8
    if size =='P5':
        check =7
    if size == 'd5':
        check = 6
    if options[0].pitch.midi-options[1].pitch.midi == check:
        return options[1]
    else:
        return options[0]

from music21 import chord, scale

def roman_numeral_from_pitch_list_and_tonic(
    pitch_list, 
    tonic
):
    '''
    Returns a roman numeral as a string given a list of Pitch objects representing a
    triad, and a Pitch representing the tonic of a major scale.
    
    Capital letters indicate major triads, lowercase indicate minor triads, and "viio" represents
    the diminished triad on scale degree vii.
    
    Root position chords have no number after them.  1st inversions have "6".  2nd inversions, "64"
    
    If the root of the chord is not part of the scale, this routine may raise an exception or
    return incorrect information.
    
    If pitch_list does not form a triad, this routine may raise an exception or return
    incorrect information
    '''
    chrd = chord.Chord(pitch_list)
    scle = scale.MajorScale(tonic)
    if tonic.name not in [x.name for x in list(scle.getChord())]:
        raise Exception
        
    if not(chrd.isTriad):
        raise Exception
    if chrd.isDiminishedTriad():
        dic = {1:'io', 2:'iio', 3:'iiio', 4:'ivo', 5:'vo', 6:'vio', 7:'viio'}
    elif chrd.isMajorTriad():
        dic = {1:'I', 2:'II', 3:'III', 4:'IV', 5:'V', 6:'VI', 7:'VII'}
    elif chrd.isMinorTriad():
        dic = {1:'i', 2:'ii', 3:'iii', 4:'iv', 5:'v', 6:'vi', 7:'vii'}
    elif chrd.isAugmentedTriad:
        dic = {1:'I+', 2:'II+', 3:'III+', 4:'IV+', 5:'V+', 6:'VI+', 7:'VII+'}

    fifth = chrd.fifth
    third = chrd.third
    rt = chrd.root()
    chord_num = scle.getScaleDegreeFromPitch(rt)
    ans = dic[chord_num]
    if pitch_list[0].name == rt.name:
        return ans
    elif pitch_list[0].name == third.name:
        return ans+'6'
    elif pitch_list[0].name == fifth.name:
        return ans + '64'
    else:
        return 'How did you get here?'
    
    from music21 import chord, scale

def roman_numeral_from_pitch_list_and_tonic_basic_scales(
    pitch_list, 
    tonic,
    scale_quality,
    is_diatonic = False
):
    '''
    Returns a roman numeral as a string given a list of ascending Pitch objects representing one of the four basic triads, 
    and a Pitch representing the tonic of a major, minor, melodic minor, harmonic_minor or modal scale.
    
    Capital letters indicate major triads, lowercase indicate minor triads, and "o" represents
    the diminished triad, "+" represents the augmented triad.
    
    Root position chords have no number after them.  1st inversions have "6".  2nd inversions, "64"
    
    If optional is_diatonic == true then the function only returns the chord if it is a diatonic chord in the scale:

    If the root of the chord is not part of the scale, this routine may raise an exception or
    return incorrect information.
    
    If pitch_list does not form a triad, this routine may raise an exception or return
    incorrect information
    '''
    scaless = {'major':scale.MajorScale, 'minor':scale.MinorScale, 'harmonic_minor': scale.HarmonicMinorScale, 
               'melodic_minor':scale.MelodicMinorScale, 'harmonic minor': scale.HarmonicMinorScale, 
               'melodic minor':scale.MelodicMinorScale, 'ionian': scale.MajorScale, 'dorian':scale.DorianScale, 
               'phrygian':scale.PhrygianScale, 'lydian':scale.LydianScale, 'mixolydian':scale.MixolydianScale, 
               'aeolian':scale.MinorScale, 'locrian':scale.LocrianScale,
               }
    chrd = chord.Chord(pitch_list)
    if scale_quality not in scaless:
        raise Exception('Try all lowercase. Only accepts major, minor, harmonic minor, melodic minor, ionian, dorian, phyrgian, lydian, mixolydian, aeolian, locrian')
    scle = scaless[scale_quality](tonic)
    if tonic.name not in [x.name for x in list(scle.getChord())]:
        raise Exception
    if not(chrd.isTriad):
        raise Exception
    if chrd.isDiminishedTriad():
        dic = {1:'io', 2:'iio', 3:'iiio', 4:'ivo', 5:'vo', 6:'vio', 7:'viio'}
    elif chrd.isMajorTriad():
        dic = {1:'I', 2:'II', 3:'III', 4:'IV', 5:'V', 6:'VI', 7:'VII'}
    elif chrd.isMinorTriad():
        dic = {1:'i', 2:'ii', 3:'iii', 4:'iv', 5:'v', 6:'vi', 7:'vii'}
    elif chrd.isAugmentedTriad:
        dic = {1:'I+', 2:'II+', 3:'III+', 4:'IV+', 5:'V+', 6:'VI+', 7:'VII+'}

    fifth = chrd.fifth
    third = chrd.third
    rt = chrd.root()
    chord_num = scle.getScaleDegreeFromPitch(rt)
    ans = dic[chord_num]

    if is_diatonic:
        if scale_quality in ['major', 'ionian']:
            if ans not in ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'viio']:
                return False
        elif scale_quality in ['minor', 'aeolian']:
            if ans not in ['i', 'iio', 'III', 'iv', 'v', 'VI', 'VII']:
                return False
        elif scale_quality in ['dorian']:
            if ans not in ['i', 'ii', 'III', 'IV', 'v', 'vio', 'VII']:
                return False
        elif scale_quality in ['phrygian']:
            if ans not in ['i', 'II', 'III', 'iv', 'vo', 'VI', 'vii']:
                return False
        elif scale_quality in ['lydian']:
            if ans not in ['I', 'II', 'iii', 'iv0', 'V', 'vi', 'vii']:
                return False
        elif scale_quality in ['mixolydian']:
            if ans not in ['I', 'ii', 'iii0', 'IV', 'v', 'vi', 'VII']:
                return False
        elif scale_quality in ['locrian']:
            if ans not in ['i0', 'II', 'iii', 'iv', 'V', 'VI', 'vii']:
                return False
        elif scale_quality in ['harmonic minor', 'harmonic_minor']:
            if ans not in ['i', 'iio', 'III+', 'iv', 'V', 'VI', 'viio']:
                return False
        elif scale_quality in ['melodic minor', 'melodic_minor']:
            if ans not in ['i', 'ii', 'III+', 'IV', 'V', 'vio', 'viio']:
                return False


    if pitch_list[0].name == rt.name:
        return ans
    elif pitch_list[0].name == third.name:
        return ans+'6'
    elif pitch_list[0].name == fifth.name:
        return ans + '64'
    else:
        return 'How did you get here?'
    
import random
def get_chord_type(bass, cur_key):
    """Given a bass note and a key object returns the diatonic intervals that would make up a root position 
    chord of the bass note in that key"""
    scaless = {'major':scale.MajorScale, 'minor':scale.MinorScale, 'harmonic_minor': scale.HarmonicMinorScale, 
               'melodic_minor':scale.MelodicMinorScale, 'harmonic minor': scale.HarmonicMinorScale, 
               'melodic minor':scale.MelodicMinorScale, 'ionian': scale.MajorScale, 'dorian':scale.DorianScale, 
               'phrygian':scale.PhrygianScale, 'lydian':scale.LydianScale, 'mixolydian':scale.MixolydianScale, 
               'aeolian':scale.MinorScale, 'locrian':scale.LocrianScale,
               }
    if bass.name not in [x.name for x in list(cur_key.getChord())]:
        return False, False
    scale_quality = cur_key.mode
    tonic = cur_key.tonic
    scle = scaless[scale_quality](tonic)
    chord_num = scle.getScaleDegreeFromPitch(bass)

    if chord_num == 3 and random.random() < .5:
        chord_num = 1
    if chord_num == 7 and random.random() < .5:
        chord_num = 5
    
    rt = list(cur_key.getChord())[chord_num-1]
    if scale_quality in ['major', 'ionian']:
        quals = ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished']
    elif scale_quality in ['minor', 'aeolian']:
        quals =  ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major']
    elif scale_quality in ['dorian']:
        quals = ['minor', 'minor', 'major', 'major', 'minor', 'diminished', 'major']
    elif scale_quality in ['phrygian']:
        quals =  ['minor', 'major', 'major', 'minor', 'diminished', 'major', 'minor']
    elif scale_quality in ['lydian']:
        quals = ['major', 'major', 'minor', 'diminished', 'major', 'minor', 'minor']
    elif scale_quality in ['mixolydian']:
        quals = ['major', 'minor', 'diminished', 'major', 'minor', 'minor', 'major']
    elif scale_quality in ['locrian']:
        quals = ['diminished', 'major', 'minor', 'minor', 'major', 'major', 'minor']
    elif scale_quality in ['harmonic minor', 'harmonic_minor']:
        quals = ['minor', 'diminished', 'augmented', 'minor', 'major', 'major', 'diminished']
    elif scale_quality in ['melodic minor', 'melodic_minor']:
        quals = ['minor', 'minor', 'augmented', 'major', 'major', 'diminished', 'diminished']

    chord_type = quals[chord_num-1]
    return chord_type, rt
    
    from music21 import chord, interval, key
import copy
from itertools import permutations
I = interval.Interval
p = pitch.Pitch
N = note.Note

def voice_leading(root, prev_chord, chord_type):
    """
    Given the root of the current chord, attempts to create a chord that follows voice leading guidelines based on the previous chord.
    """

    # Define the intervals to use based on the chord type
    if chord_type == "major":
        intervals = [I('M3'), I('P5')]
    elif chord_type == "minor":
        intervals = [I('m3'), I('P5')]
    elif chord_type == "augmented":
        intervals = [I('M3'), I('A5')]
    elif chord_type == "diminished":
        intervals = [I('m3'), I('d5')]

    # Calculate the notes of the chord based on the baseline note and intervals
    chrd = []
    for interval in intervals:
        temp = copy.deepcopy(root)
        chrd.append(temp.transpose(interval))
    # chrd = chord.Chord(chrd)
    # Apply voice leading
    if prev_chord:
        prev_midi = [x.pitches[0].midi for x in prev_chord] # get the midi notes of the chords
        cur_midi = [x.pitches[0].midi for x in chrd]

        best_val = float('inf') # want to find the best chord 
        best_order = None
        for x in list(permutations(cur_midi, r=len(cur_midi))): # brute force check all the options
            test = []
            for i in range(len(x)):
                diff = abs(x[i]-prev_midi[i]) # check differences in midi notes
                if diff == 7: # no parallel fifths
                    continue
                test.append(diff)
            
            if sum(test)< best_val and sum(test)> 0: # want to minimize the distance moved but want to move at least a little bit. Don't want to sit on the same chord
                best_val = sum(test)
                best_order = x
        final_chord = [p(x) for x in best_order] # get the next chord
        return final_chord
    return chrd # if there is not a previous chord just return the current chord
from music21 import corpus, stream, instrument
import random

def sample(seed=None):
    """Returns a random Bach piece based on a random.random() seed."""
    if seed != None:
        random.seed(seed)
    bach_corpus = corpus.search('bach')
    corpus_num = int(random.random()*len(bach_corpus))
    return bach_corpus[corpus_num].parse()

def Find_Bassline_And_Key(seed = None):
    '''Randomly finds a Bach piece given a seed for random.random()
      that has a bassline and returns the bassline and key.'''
    found = False
    while not(found):
        part = sample(seed)
        try:
            bach = part.getElementById('bass')
            if bach == None and seed != None:
                random.seed()
                seed = random.random()*1000
                continue
            found = True
        except:
            random.seed()
            seed = random.random()*1000
            pass
    return bach, part.analyze('key')

def composition(seeds=None, max_chords = 100, extra_seeds = True):
    '''
    Given a random.random() seeding and a max number of chords to include, generates 
    a stream.Stream containing a piece that is made from various Bach basslines.
    '''
    cnt = 0
    seed = seeds[cnt]
    cnt +=1
    accordion = instrument.Accordion()
    bassline, cur_key  = Find_Bassline_And_Key(seed)
    prev_chord = False
    chords = stream.Part()
    bass_notes = stream.Part()
    count = 0
    chords.insert(0, accordion)
    bass_notes.insert(0, accordion)

    # print(bassline)
    while True:
        try:
            bassline.recurse().notes
        except:
            random.seed()
            nseed = seeds[cnt]
            cnt +=1 
            cnt %= 5
            bassline, cur_key  = Find_Bassline_And_Key(nseed)
            extra_seeds = True
        for bass in bassline.recurse().notes:
            count +=1
            chord_type, root = get_chord_type(bass, cur_key)
            if chord_type == False:
                break
            cur_chord = voice_leading(root, prev_chord, chord_type)
            # cur_chord.insert(0,bass)
            bass_notes.append(bass)
            ql =  bass.duration
            prev_chord = chord.Chord(copy.deepcopy(cur_chord))
            to_append = chord.Chord(cur_chord)
            to_append.duration = ql
            chords.append(to_append)
            if count >= max_chords:
                break
        if extra_seeds:
            random.seed()
            new_seed = seeds[cnt]
            cnt +=1 
            cnt %= 5
            bassline, cur_key  = Find_Bassline_And_Key(new_seed)
        else:
            bassline, cur_key  = Find_Bassline_And_Key()
        if count >= max_chords:
            break
    print(chords, bass_notes)
    return stream.Stream([chords, bass_notes])



### TODO####
# Get random quantum seeds CHANGE THE LIST BELOW#


quantum_seeds = [1123,213,45,73,134]
print(quantum_seeds)

comp = composition(seeds = quantum_seeds)
comp.show()
# comp.show('midi')
comp.write('midi', fp='output_file.mid')